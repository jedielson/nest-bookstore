import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 200,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    length: 200,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Gender,
    default: Gender.MALE,
  })
  gender: string;
}
