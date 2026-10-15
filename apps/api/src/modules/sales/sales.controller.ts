import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { RequirePermissions } from '../iam/auth.decorators';

@ApiTags('sales')
@ApiBearerAuth()
@Controller()
export class SalesController {
  constructor(private readonly sales: SalesService) {}

  @Post('customers')
  @RequirePermissions('customer:create')
  createCustomer(@Body() dto: CreateCustomerDto) {
    return this.sales.createCustomer(dto);
  }

  @Post('sales-orders')
  @RequirePermissions('sales_order:create')
  createOrder(@Body() dto: CreateSalesOrderDto) {
    return this.sales.createOrder(dto);
  }

  @Post('sales-orders/:id/confirm')
  @RequirePermissions('sales_order:confirm')
  confirm(@Param('id') id: string) {
    return this.sales.confirm(id);
  }
}
