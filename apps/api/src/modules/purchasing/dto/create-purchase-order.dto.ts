import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreatePurchaseOrderLineDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitCost: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  supplierId: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  @ArrayMinSize(1)
  lines: CreatePurchaseOrderLineDto[];
}
