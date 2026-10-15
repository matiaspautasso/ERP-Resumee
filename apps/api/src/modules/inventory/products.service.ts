import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { StockLedger } from './stock-ledger';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly ledger: StockLedger,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.products.save(this.products.create(dto));
  }

  findAll(): Promise<Product[]> {
    return this.products.find({ order: { createdAt: 'DESC' } });
  }

  async getStock(productId: string): Promise<{ productId: string; quantityOnHand: number }> {
    const quantityOnHand = await this.ledger.getQuantityOnHand(productId);
    return { productId, quantityOnHand };
  }
}
