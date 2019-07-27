import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname;

  @Column({ nullable: true })
  lastname;

  @Column({ nullable: true })
  gender;

  @Column({ nullable: true, default: false })
  genderActive;

  @Column({ nullable: true })
  birthday;

  @Column({ nullable: true, default: false })
  birthdayActive;

  @Column({ nullable: true })
  intrests;

  @Column({ nullable: true })
  avatar;

  @Column({ nullable: true })
  bio;

  @Column({ nullable: true })
  status;

  @Column({ nullable: true })
  xp;

  @Column({ nullable: true })
  city;

  @OneToOne(type => User, user => user.profile)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
