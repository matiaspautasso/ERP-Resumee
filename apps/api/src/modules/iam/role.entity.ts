import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  /** Permissions granted by this role, each written `resource:action` (or `*` for all). */
  @Column({ type: 'simple-array', default: '' })
  permissions: string[];
}
