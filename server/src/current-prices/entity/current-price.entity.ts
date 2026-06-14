import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import VehicleConfiguration from '../../vehicle-configurations/entities/vehicle-configuration.entity';
import Dealer from '../../dealers/entities/dealer.entity';
import User from '../../users/entities/user.entity';

@Entity('current_prices')
@Index(['vehicleConfigurationId', 'dealerId'], { unique: true })
export default class CurrentPrice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'vehicle_configuration_id',
    type: 'integer',
    nullable: false,
  })
  vehicleConfigurationId!: number;

  @Column({
    name: 'dealer_id',
    type: 'integer',
    nullable: true,
  })
  dealerId?: number;

  @Column({
    name: 'price_secure_locks_akl',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceSecureLocksAKL?: string;

  @Column({
    name: 'price_secure_locks_add_key',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceSecureLocksAddKey?: string;

  @Column({
    name: 'price_secure_locks_program_only',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceSecureLocksProgramOnly?: string;

  @Column({
    name: 'price_secure_locks_parts',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceSecureLocksParts?: string;

  @Column({
    name: 'price_dealer_transmitter',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceDealerTransmitter?: string;

  @Column({
    name: 'price_dealer_program',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceDealerProgram?: string;

  @Column({
    name: 'price_dealer_blade',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  priceDealerBlade?: string;

  @Column({
    name: 'vin',
    type: 'text',
    nullable: true,
  })
  vin?: string; // text

  @Column({
    name: 'part_number',
    type: 'text',
    nullable: true,
  })
  partNumber?: string; // text

  @Column({
    name: 'link',
    type: 'text',
    nullable: true,
  })
  link?: string; // text

  @Column({
    name: 'comments',
    type: 'text',
    nullable: true,
  })
  comments?: string; // text

  @Column({
    name: 'date_called',
    type: 'date',
    nullable: true,
  })
  dateCalled?: string; // date

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date; // timestamp [not null]

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt!: Date; // timestamp [not null]

  @Column({ name: 'created_by_user_id', type: 'integer', nullable: false })
  createdByUserId!: number; // integer [not null]

  @Column({ name: 'updated_by_user_id', type: 'integer', nullable: false })
  updatedByUserId!: number; // integer [not null]

  @ManyToOne(() => VehicleConfiguration, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'vehicle_configuration_id' })
  vehicleConfiguration!: VehicleConfiguration;

  @ManyToOne(() => Dealer, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'dealer_id' })
  dealer?: Dealer;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser!: User;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedByUser!: User;
}

// Table current_prices {
//   id integer [primary key, increment]
//   vehicle_configuration_id integer [not null]
//   dealer_id integer

//   price_secure_locks_akl numeric(10,2)
//   price_secure_locks_add_key numeric(10,2)
//   price_secure_locks_program_only numeric(10,2)
//   price_secure_locks_parts numeric(10,2)
//   price_dealer_transmitter numeric(10,2)
//   price_dealer_program numeric(10,2)
//   price_dealer_blade numeric(10,2)

//   vin text
//   part_number text
//   link text
//   comments text
//   date_called date

//   created_at timestamp [not null]
//   updated_at timestamp [not null]
//   created_by_user_id integer [not null]
//   updated_by_user_id integer [not null]

//   indexes {
//     (vehicle_configuration_id, dealer_id) [unique]
//   }
// }
