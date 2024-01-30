import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import { Item } from '../models/item'
import {Order} from "../models/cart";



@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemRef: AngularFirestoreCollection<Item>;
  orderRef: AngularFirestoreCollection<Order>;

  constructor(private afs: AngularFirestore) {
    this.itemRef = afs.collection('pizza');
    this.orderRef = afs.collection('orders');
  }
  getItems(): AngularFirestoreCollection<Item> {
    return this.itemRef;
  }

  getOrders() {
    return this.orderRef;

  }

  deleteOrder(id: string | undefined) {
    return this.orderRef.doc(id).delete();
  }

  create(item: Item) {
    return this.itemRef.add({...item});
  }

  getItem(id: string) {
    return this.afs.doc<Item>(`pizza/${id}`).valueChanges();
  }

  update(item: Item): Promise<void> {
    if (!item.id) {
      throw new Error('Missing item ID');
    }
    return this.itemRef.doc(item.id).update({...item});
  }

  delete(id: string | undefined): Promise<void> {
    return this.itemRef.doc(id).delete();
  }

}
