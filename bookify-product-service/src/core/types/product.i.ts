import { Stock } from "./stock.i";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
  stock?: Stock;
}
