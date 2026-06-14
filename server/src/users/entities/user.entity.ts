import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../interfaces/user-role.interface';
import CurrentPrice from '../../current-prices/entity/current-price.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  email!: string;

  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ name: 'password_hash', type: 'text', nullable: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
    nullable: false,
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt!: Date;

  // позволят отдельно получить записи, которые создал этот юзер
  @OneToMany(() => CurrentPrice, (currentPrice) => currentPrice.createdByUser)
  createdCurrentPrices!: CurrentPrice[];

  // и записи, которые он обновил
  @OneToMany(() => CurrentPrice, (currentPrice) => currentPrice.updatedByUser)
  updatedCurrentPrices!: CurrentPrice[];
}

// Table users {
//   id integer [primary key, increment]
//   email varchar [unique, not null]
//   first_name varchar [not null]
//   last_name varchar
//   password_hash text [not null]
//   role varchar [not null] // admin, manager, viewer
//   created_at timestamp [not null]
//   updated_at timestamp [not null]
// }
