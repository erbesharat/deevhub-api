import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true, default: false })
  genderActive: boolean;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true, default: false })
  birthdayActive: boolean;

  @Column('simple-array', { nullable: true })
  intrests: string[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  xp: number;

  @Column({ nullable: true })
  city: string;

  @OneToOne(type => User, user => user.profile)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
