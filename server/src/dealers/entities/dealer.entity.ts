import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CurrentPrice from '../../current-prices/entity/current-price.entity';

@Entity('dealers')
export default class Dealer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  // позволит можно получить все записи цен дилера
  @OneToMany(() => CurrentPrice, (currentPrice) => currentPrice.dealer)
  currentPrices!: CurrentPrice[];
}

// Table dealers {
//   id integer [primary key, increment]
//   name varchar [unique, not null]
//   phone varchar
//   address text
// }
