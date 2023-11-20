import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy';
import { Cart } from './entities/carts';
import { CartItem } from './entities/cartItem';
import { Product } from './entities/product';
import { User } from './entities/user';
import { Order } from './entities/order';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadEntities: true,
      ssl: {
        ca: process.env.PG_CA,
        rejectUnauthorized: false
      },
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Product, User, Order]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}