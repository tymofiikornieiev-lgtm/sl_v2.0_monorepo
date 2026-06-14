import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ignition_types')
export default class IgnitionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name!: string;
}

// Table ignition_types {
//   id integer [primary key, increment]
//   name varchar [unique, not null]
// }
