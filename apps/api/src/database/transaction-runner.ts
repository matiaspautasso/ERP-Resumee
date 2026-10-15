import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

/**
 * The seam for atomicity. `run` opens a database transaction, hands the caller an EntityManager,
 * and commits or rolls back as one unit. Callers compose multiple repository operations inside
 * `work` knowing they all succeed or all fail together.
 */
@Injectable()
export class TransactionRunner {
  constructor(private readonly dataSource: DataSource) {}

  run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }
}
