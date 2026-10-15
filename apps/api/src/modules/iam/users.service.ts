import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
  ) {}

  async create(email: string, password: string, roleNames: string[]): Promise<User> {
    const roles = await this.roles.find({ where: roleNames.map((name) => ({ name })) });
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = this.users.create({ email, passwordHash, roles });
    return this.users.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  verifyPassword(user: User, password: string): Promise<boolean> {
    return argon2.verify(user.passwordHash, password);
  }

  /** Union of the permissions granted by all of a user's roles. */
  effectivePermissions(user: User): string[] {
    return [...new Set((user.roles ?? []).flatMap((role) => role.permissions))];
  }
}
