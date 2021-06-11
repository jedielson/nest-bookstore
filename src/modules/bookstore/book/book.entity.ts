import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Author, BookAuthor } from '../author/author.entity';

@Table
export class Book extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  edition: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  publicationYear: number;

  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[];
}
