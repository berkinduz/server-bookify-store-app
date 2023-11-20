import { Controller, Get, Body, Req, Post, HttpStatus } from '@nestjs/common';

import { AppRequest } from '../shared';
import { ProductService } from './services';
import { Product } from './models';


const validateBodyItem = (product: Product) => {
  const { title, description, price, count } = product;
    const isValidCartItem =
      typeof title === 'string' && typeof description === 'string'
      && Number.isFinite(price) && Number.isFinite(count);

    return isValidCartItem;
}
@Controller('api/product')
export class ProductController {
  constructor(
    private productService: ProductService,
  ) { }

  @Get()
  async getProducts() {
    const products = await this.productService.getAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { products },
    }
  }

  @Get('/available')
  async getAvailableProducts() {
    const availableProducts = await this.productService.getAvailable();
    if (availableProducts.length) {
      return {
        statusCode: HttpStatus.OK,
      message: 'OK',
      data: { availableProducts },
      }
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No available products',
    }
  }

  @Post()
  async createProduct(@Req() req: AppRequest, @Body() body) {
    const isItemsValid = validateBodyItem(body);

    if (isItemsValid) {
      await this.productService.createOne(body);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          tex: 'Created Successfully',
        },
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid product',
      };
    }
  }

}
