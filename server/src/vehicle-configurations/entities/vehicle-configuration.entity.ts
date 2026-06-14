import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Make from '../../makes/entities/make.entity';
import Model from '../../models/entities/model.entity';
import IgnitionType from '../../ignition-types/entities/ignition-type.entity';
import KeyType from '../../key-types/entities/key-type.entity';
import CurrentPrice from '../../current-prices/entity/current-price.entity';

@Entity('vehicle_configurations')
@Index(
  ['year', 'makeId', 'modelId', 'ignitionTypeId', 'keyTypeId', 'buttonsCount'],
  { unique: true },
)
export default class VehicleConfiguration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'smallint', nullable: false })
  year!: number;

  @Column({ name: 'make_id', type: 'integer', nullable: false })
  makeId!: number;

  @Column({ name: 'model_id', type: 'integer', nullable: false })
  modelId!: number;

  @Column({ name: 'ignition_type_id', type: 'integer', nullable: false })
  ignitionTypeId!: number;

  @Column({ name: 'key_type_id', type: 'integer', nullable: false })
  keyTypeId!: number;

  @Column({ name: 'buttons_count', type: 'smallint', nullable: false })
  buttonsCount!: number;

  @ManyToOne(() => Make, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'make_id' })
  make!: Make;

  @ManyToOne(() => Model, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    { name: 'make_id', referencedColumnName: 'makeId' },
    { name: 'model_id', referencedColumnName: 'id' },
  ])
  model!: Model;

  @ManyToOne(() => IgnitionType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'ignition_type_id' })
  ignitionType!: IgnitionType;

  @ManyToOne(() => KeyType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'key_type_id' })
  keyType!: KeyType;

  // позволит получать можно получить все связанные цены
  @OneToMany(
    () => CurrentPrice,
    (currentPrice) => currentPrice.vehicleConfiguration,
  )
  currentPrices!: CurrentPrice[];
}

// Table vehicle_configurations {
//   id integer [primary key, increment]
//   year smallint [not null]
//   make_id integer [not null]
//   model_id integer [not null]
//   ignition_type_id integer [not null]
//   key_type_id integer [not null]
//   buttons_count smallint [not null]

//     indexes {
//     (year, make_id, model_id, ignition_type_id, key_type_id, buttons_count) [unique]
//   }
// }
// Ref: vehicle_configurations.make_id > makes.id
// Ref: vehicle_configurations.(make_id, model_id) > models.(make_id, id)
// Ref: vehicle_configurations.ignition_type_id > ignition_types.id
// Ref: vehicle_configurations.key_type_id > key_types.id
