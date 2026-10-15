import request from 'supertest';
import { startTestApp, TestApp } from './support/test-app';

describe('Order flow (integration)', () => {
  let ctx: TestApp;
  let http: ReturnType<typeof request>;
  let adminToken: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    ctx = await startTestApp();
    http = request(ctx.app.getHttpServer());
    adminToken = await ctx.loginAs('admin@test.local', 'pw');
  });

  afterAll(async () => {
    await ctx.close();
  });

  async function createProductWithStock(stock: number): Promise<string> {
    const sku = `SKU-${Math.random().toString(36).slice(2, 8)}`;
    const product = await http
      .post('/products')
      .set(auth(adminToken))
      .send({ sku, name: 'Widget', unitPrice: 1000 })
      .expect(201);
    const productId = product.body.id as string;

    const supplier = await http
      .post('/suppliers')
      .set(auth(adminToken))
      .send({ name: 'Acme' })
      .expect(201);

    const order = await http
      .post('/purchase-orders')
      .set(auth(adminToken))
      .send({
        supplierId: supplier.body.id,
        lines: [{ productId, quantity: stock, unitCost: 500 }],
      })
      .expect(201);

    await http.post(`/purchase-orders/${order.body.id}/receive`).set(auth(adminToken)).expect(201);

    return productId;
  }

  async function createSalesOrder(productId: string, quantity: number): Promise<string> {
    const customer = await http
      .post('/customers')
      .set(auth(adminToken))
      .send({ name: 'Jane' })
      .expect(201);
    const order = await http
      .post('/sales-orders')
      .set(auth(adminToken))
      .send({ customerId: customer.body.id, lines: [{ productId, quantity, unitPrice: 1200 }] })
      .expect(201);
    return order.body.id as string;
  }

  async function stockOf(productId: string): Promise<number> {
    const response = await http
      .get(`/products/${productId}/stock`)
      .set(auth(adminToken))
      .expect(200);
    return response.body.quantityOnHand as number;
  }

  it('receives a purchase (stock up) then confirms a sale (stock down)', async () => {
    const productId = await createProductWithStock(10);
    expect(await stockOf(productId)).toBe(10);

    const orderId = await createSalesOrder(productId, 4);
    await http.post(`/sales-orders/${orderId}/confirm`).set(auth(adminToken)).expect(201);

    expect(await stockOf(productId)).toBe(6);
  });

  it('rejects a confirmation that would oversell and rolls back, leaving stock untouched', async () => {
    const productId = await createProductWithStock(5);
    const orderId = await createSalesOrder(productId, 8);

    const response = await http
      .post(`/sales-orders/${orderId}/confirm`)
      .set(auth(adminToken))
      .expect(409);
    expect(response.body.error).toBe('InsufficientStockError');

    // Transaction rolled back: no outbound movement was written.
    expect(await stockOf(productId)).toBe(5);
  });

  it('forbids receiving a purchase order without the purchase_order:receive permission', async () => {
    const salesToken = await ctx.loginAs('sales@test.local', 'pw');
    const product = await http
      .post('/products')
      .set(auth(adminToken))
      .send({
        sku: `SKU-${Math.random().toString(36).slice(2, 8)}`,
        name: 'Gadget',
        unitPrice: 900,
      })
      .expect(201);
    const supplier = await http.post('/suppliers').set(auth(adminToken)).send({ name: 'Globex' });
    const order = await http
      .post('/purchase-orders')
      .set(auth(adminToken))
      .send({
        supplierId: supplier.body.id,
        lines: [{ productId: product.body.id, quantity: 1, unitCost: 1 }],
      });

    await http.post(`/purchase-orders/${order.body.id}/receive`).set(auth(salesToken)).expect(403);
  });

  it('rejects an unauthenticated request', async () => {
    await http.get('/products').expect(401);
  });
});
