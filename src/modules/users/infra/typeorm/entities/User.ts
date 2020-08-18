import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from '@modules/users/entities/User';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  hash: string;

  @Column({ name: 'extention_avatar' })
  @Exclude()
  extentionAvatar?: string;

  @Column('enum', { name: 'status', enum: 'UserStatus' })
  status: UserStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar' })
  getAvatar(): string | null {
    if (this.extentionAvatar) {
      return `http://localhost:3333/users/${this.id}/avatar`;
    }
    return null;
  }
}
