import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  token: string;

  @Column({ name: 'expiration_date', type: 'timestamp', nullable: false })
  expirationDate: Date;

  @Column({
    default: true,
  })
  active: boolean;

  @ManyToOne(type => User, user => user.tokens)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
