import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart, CartStatus } from 'src/database/entities/carts';
import { CartItem } from 'src/database/entities/cartItem';
import { Product } from 'src/database/entities/product';

import { CartUpdate, Cart as ICart } from '../models';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findByUserId(userId: string): Promise<ICart> {
    const userCart = await this.cartRepository.findOne({
      where: { userId: userId, status: CartStatus.OPEN },
      relations: ['items', 'items.product'],
    });

    return userCart;
  }

  createByUserId(userId: string) {
    const cart = new Cart();
    cart.userId = userId;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    cart.status = CartStatus.OPEN;
    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string, cartId?: string): Promise<ICart> {
    let userCart;

    if (cartId) {
      userCart = await this.cartRepository.findOne(cartId);
    } else {
      userCart = await this.cartRepository.findOne({
        where: { userId: userId, status: CartStatus.OPEN },
      });
    }

    const cartItems = await this.cartItemRepository.find({
      where: { cartId: userCart?.id },
      relations: ['product'],
    });

    if (userCart) {
      return {
        ...userCart,
        items: cartItems,
      };
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: CartUpdate): Promise<ICart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);

    await Promise.all(
      items.map(async item => {
        let cartItem = await this.cartItemRepository.findOne({
          where: { cartId: cartId, productId: item.productId },
        });

        if (cartItem) {
          if (item.count > 0) {
            cartItem.count = item.count;
            await this.cartItemRepository.save(cartItem);
          } else {
            await this.cartItemRepository.remove(cartItem);
          }
        } else {
          const product = await this.productRepository.findOne(item.productId);
          if (product) {
            cartItem = new CartItem();
            cartItem.cart = { id: cartId } as Cart;
            cartItem.product = product;
            cartItem.count = item.count;
  
            await this.cartItemRepository.save(cartItem);
          }
        }
      }),
    );

    const updatedItems = await this.cartItemRepository.find({
      where: { cartId: cartId },
      relations: ['product'],
    });

    return { id: cartId, items: updatedItems };
  }

  async removeByUserId(userId): Promise<void> {
    const userCart = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    await this.cartItemRepository.delete({ cart: userCart });
    await this.cartRepository.remove(userCart);
  }

}
