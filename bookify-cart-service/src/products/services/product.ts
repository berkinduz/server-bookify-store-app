import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product as IProduct } from '../models';
import { Product } from 'src/database/entities/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    const products = await this.productsRepository
    .createQueryBuilder("product")
    .getMany();
    return products;
  }

  async getAvailable(): Promise<Product[]> {
    
      const products = await this.productsRepository
        .createQueryBuilder('product')
        .select(['product.id', 'product.title', 'COUNT(product.id) AS productCount'])
        .groupBy('product.id, product.title')
        .having('product.count > 0')
        .getMany();
    
      return products;
    }

  async createOne(product: IProduct): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    await this.productsRepository.save(newProduct);
    return newProduct;
  }
}