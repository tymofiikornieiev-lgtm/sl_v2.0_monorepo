import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MakesModule } from './makes/makes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ModelsModule } from './models/models.module';
import { IgnitionTypesModule } from './ignition-types/ignition-types.module';
import { KeyTypesModule } from './key-types/key-types.module';
import { DealersModule } from './dealers/dealers.module';
import { VehicleConfigurationsModule } from './vehicle-configurations/vehicle-configurations.module';
import { CurrentPricesModule } from './current-prices/current-prices.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import envValidator from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guard/authorize.guard';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from './auth/config/auth.config';
import { RolesGuard } from './auth/guard/roles.guard';

const ENV = process.env.NODE_ENV;
console.log('ENV-APP', ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      validationSchema: envValidator,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('database.type'),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),

        synchronize: config.get<boolean>('database.synchronize'),
        autoLoadEntities: config.get<boolean>('database.autoLoadEntities'),
      }),
    }),
    JwtModule.registerAsync(authConfig.asProvider()),
    MakesModule,
    UsersModule,
    ModelsModule,
    IgnitionTypesModule,
    KeyTypesModule,
    DealersModule,
    VehicleConfigurationsModule,
    CurrentPricesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthorizeGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
