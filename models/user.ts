import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Role } from './role';
import { Profile } from './profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', nullable: true })
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @OneToOne(type => Role)
  @JoinColumn()
  role: Role;

  @OneToOne(type => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
