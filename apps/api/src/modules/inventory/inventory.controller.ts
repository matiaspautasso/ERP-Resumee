import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RequirePermissions } from '../iam/auth.decorators';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller()
export class InventoryController {
  constructor(private readonly products: ProductsService) {}

  @Post('products')
  @RequirePermissions('product:create')
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Get('products')
  findAll() {
    return this.products.findAll();
  }

  @Get('products/:id/stock')
  getStock(@Param('id') id: string) {
    return this.products.getStock(id);
  }
}
