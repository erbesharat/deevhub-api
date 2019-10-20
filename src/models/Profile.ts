import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column({
    default: false,
  })
  genderActive: boolean;

  @Column({
    nullable: true,
  })
  birthday: Date;

  @Column({
    default: false,
  })
  birthdayActive: boolean;

  @Column({
    default: 0,
  })
  xp: number;

  @Column({
    default: 0,
  })
  credit: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
