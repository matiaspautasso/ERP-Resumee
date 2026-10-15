import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchasingService } from './purchasing.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { RequirePermissions } from '../iam/auth.decorators';

@ApiTags('purchasing')
@ApiBearerAuth()
@Controller()
export class PurchasingController {
  constructor(private readonly purchasing: PurchasingService) {}

  @Post('suppliers')
  @RequirePermissions('supplier:create')
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.purchasing.createSupplier(dto);
  }

  @Post('purchase-orders')
  @RequirePermissions('purchase_order:create')
  createOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchasing.createOrder(dto);
  }

  @Post('purchase-orders/:id/receive')
  @RequirePermissions('purchase_order:receive')
  receive(@Param('id') id: string) {
    return this.purchasing.receive(id);
  }
}
