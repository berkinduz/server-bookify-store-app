import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

import { Order } from 'src/database/entities/order';
import { CartItem } from 'src/database/entities/cartItem';
import { Cart, CartStatus } from 'src/database/entities/carts';

import { Order as IOrder } from '../models';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }


  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);
    return order;
  }

  async create(orderData: Partial<IOrder>): Promise<Order> {
    return getConnection().transaction(async entityManager => {
      const cart = await entityManager.findOne(Cart, orderData.cartId, {
        relations: ['items'],
      });
      const items = cart.items.map(item => {
        const orderItem = new CartItem();
        orderItem.count = item.count;
        orderItem.product = item.product;
        return orderItem;
      });

      const newOrder = new Order();
      newOrder.cartId = orderData.cartId;
      newOrder.userId = orderData.userId;
      newOrder.items = items;
      newOrder.items.forEach(item => (item.cart = cart));
      newOrder.total = orderData.total;
      newOrder.status = CartStatus.ORDERED;
      newOrder.comments = orderData.comments;
      newOrder.payment = {
        type: 'payment type',
        ...orderData.payment
      };
      newOrder.delivery = {
        type: 'delivery type',
        address: 'address',
        ...orderData.delivery
      };

      const createdOrder = await entityManager.save(newOrder);
      cart.status = CartStatus.ORDERED;
      await entityManager.save(cart);

      return createdOrder;
    });
  }

  async update(orderId: string, data: Order): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    order.cartId = data.cartId || order.cartId;
    order.userId = data.userId || order.userId;
    order.items = data.items || order.items;
    order.total = data.total || order.total;
    order.status = data.status || (order.status as CartStatus);
    order.comments = data.comments || order.comments;
    order.payment = data.payment || order.payment;
    order.delivery = data.delivery || order.delivery;

    return await this.orderRepository.save(order);
  }
}
