import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  sku: string;

  @IsString()
  @MinLength(1)
  name: string;

  /** Sale price in minor units (e.g. cents). */
  @IsInt()
  @Min(0)
  unitPrice: number;
}
