import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../author/author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 200,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 10,
  })
  edition: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  publicationYear: number;

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  authors: Author[];
}
