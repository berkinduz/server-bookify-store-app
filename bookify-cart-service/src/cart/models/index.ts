export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product: Product,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
}


export type CartItemUpdate = {
  productId: string,
  count: number
}

export type CartUpdate = {
  id: string,
  items: CartItemUpdate[],
}