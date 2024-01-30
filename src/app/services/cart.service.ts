import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from "../models/cart";
import { Order } from "../models/cart";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Item } from "../models/item";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemSubject:BehaviorSubject<any> = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemSubject.asObservable();

  constructor(private afs: AngularFirestore, private alertService: AlertService) {}

  addToCart(item: Item, quantity: number = 1) {
    const currentItems = this.itemSubject.getValue();
    const existingCartItem = currentItems.find((cartItem: { item: { id: string | undefined; }; }) =>
      cartItem.item.id === item.id);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      currentItems.push({item: item, quantity: quantity});
    }

    this.itemSubject.next(currentItems);

  }

  removeFromCart(itemId: string | undefined) {
    const currentItems = this.itemSubject.getValue();
    const cartItemIndex = currentItems.findIndex((cartItem: { item: { id: string | undefined; }; }) =>
      cartItem.item.id === itemId);

    if (cartItemIndex !== -1) {
      const cartItem = currentItems[cartItemIndex];
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        currentItems.splice(cartItemIndex, 1);
      }

      this.itemSubject.next(currentItems);
    }
  }

  calculateTotal(): number {
    const currentItems = this.itemSubject.getValue();
    return currentItems.reduce((total: number, cartItem: { item: { price: number; }; quantity: number; }) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  }

  async placeOrder(): Promise<void> {
    const order = {
      items: this.itemSubject.getValue(),
      total: this.calculateTotal()
    };

    try {
      await this.afs.collection('orders').add(order);
      this.itemSubject.next([]);
    } catch(error) {
        this.alertService.showError('Nu am putut plasa comanda');
      }
  }


}

