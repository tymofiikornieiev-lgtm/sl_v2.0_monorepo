import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Model from '../../models/entities/model.entity';

@Entity('makes')
export default class Make {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @OneToMany(() => Model, (model) => model.make)
  models!: Model[];
}

// Table makes {
//   id integer [primary key, increment]
//   name varchar [unique, not null]
// }
