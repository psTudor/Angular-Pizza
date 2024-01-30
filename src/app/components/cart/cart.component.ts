import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { CartItem } from "../../models/cart";
import firebase from "firebase/compat";
import Item = firebase.analytics.Item;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements  OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    })
  }

  removeFromCart(item: Item) {
    this.cartService.removeFromCart(item.id);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.quantity * item.item.price!), 0)
  }

  placeOrder() {
    this.cartService.placeOrder();
  }

}
