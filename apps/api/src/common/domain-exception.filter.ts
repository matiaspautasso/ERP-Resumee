import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InsufficientStockError } from '../modules/inventory/insufficient-stock.error';
import { SalesOrderNotConfirmableError } from '../modules/sales/sales-order.rules';
import { PurchaseOrderNotReceivableError } from '../modules/purchasing/purchase-order.rules';

/**
 * Translates domain errors into HTTP responses, so services can throw meaningful domain
 * exceptions without knowing about HTTP. A rule violation is the client's fault → 409 Conflict.
 */
@Catch(InsufficientStockError, SalesOrderNotConfirmableError, PurchaseOrderNotReceivableError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      error: exception.name,
      message: exception.message,
    });
  }
}
