import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from './role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ select: false })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(type => Role)
  @JoinColumn()
  role: Role;
}
