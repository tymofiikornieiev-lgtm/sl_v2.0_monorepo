import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('key_types')
export default class KeyType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name!: string;
}

// Table key_types {
//   id integer [primary key, increment]
//   name varchar [unique, not null]
// }
