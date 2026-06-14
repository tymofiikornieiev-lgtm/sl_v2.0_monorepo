import 'reflect-metadata';
import { DataSource } from 'typeorm';

import User from '../users/entities/user.entity';
import Make from '../makes/entities/make.entity';
import Model from '../models/entities/model.entity';
import IgnitionType from '../ignition-types/entities/ignition-type.entity';
import KeyType from '../key-types/entities/key-type.entity';
import Dealer from '../dealers/entities/dealer.entity';
import VehicleConfiguration from '../vehicle-configurations/entities/vehicle-configuration.entity';
import CurrentPrice from '../current-prices/entity/current-price.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'secure-locks-db',

  synchronize: false,
  logging: true,
  // extra: { connectionTimeoutMillis: 5000 },

  entities: [
    User,
    Make,
    Model,
    IgnitionType,
    KeyType,
    Dealer,
    VehicleConfiguration,
    CurrentPrice,
  ],
  migrations: ['src/database/migrations/*.ts'],
});
