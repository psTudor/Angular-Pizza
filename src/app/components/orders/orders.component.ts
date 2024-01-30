import {Component, OnInit} from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Order } from "../../models/cart";
import {ItemService} from "../../services/item.service";
import {map} from "rxjs/operators";
import {Item} from "../../models/item";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private authSubscription!: Subscription;

  orders?: Order[];
  constructor(private itemService: ItemService,
              private auth: AuthService,) {}

  ngOnInit() {
    this.authSubscription = this.auth.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.roles?.admin;
    });
    this.getOrders();
  }

  getOrders() {
    this.itemService.getOrders().snapshotChanges().pipe(
      map(changes =>
        changes.map(i =>
          ({
            ...i.payload.doc.data() as Order,
            id: i.payload.doc.id, })
        )
      )
    ).subscribe(data => {
      this.orders = data;
      console.log(this.orders);
    });
  }

  deleteOrder(id:string |undefined) {
    const confirmation = confirm(`Do you want to delete order: ${id}?`);
    if (confirmation) {
      this.itemService.deleteOrder(id).then(() => {
        this.getOrders();
      }).catch(error => {
        console.error("Error deleting item: ", error);
      })
    }
  }

}
