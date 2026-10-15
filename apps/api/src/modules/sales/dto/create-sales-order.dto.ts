import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateSalesOrderLineDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitPrice: number;
}

export class CreateSalesOrderDto {
  @IsUUID()
  customerId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderLineDto)
  @ArrayMinSize(1)
  lines: CreateSalesOrderLineDto[];
}
