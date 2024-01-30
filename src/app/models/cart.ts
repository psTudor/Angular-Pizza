import { Item } from "./item";

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface Order {
  id?:string;
  items: CartItem[];
  total: number;
}
