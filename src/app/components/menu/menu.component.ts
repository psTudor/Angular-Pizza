import {Component, OnInit} from '@angular/core';
import { ItemService } from "../../services/item.service";
import { Item } from "../../models/item";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";
import { CartService } from "../../services/cart.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private authSubscription!: Subscription;
  items?: Item[];
  message: string | null = null;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private auth: AuthService,
    private cartService: CartService) {}
  ngOnInit() {
    this.authSubscription = this.auth.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.roles?.admin;

    });

    this.getItems()
  }

  getItems() {
    this.itemService.getItems().snapshotChanges().pipe(
      map(changes =>
      changes.map(i =>
          ({
           ...i.payload.doc.data() as Item,
            id: i.payload.doc.id, })
        )
      )
    ).subscribe(data => {
      this.items = data;
      console.log(this.items);
    });
  }

  deleteItem(id:string |undefined, name:string | undefined) {
    const confirmation = confirm(`This action will delete '${name}. Are you sure?`);
    if (confirmation) {
      this.itemService.delete(id).then(() => {
        this.getItems();
      }).catch(error => {
        console.error("Error deleting item: ", error);
      })
    }
  }

  goToUpdate(item:Item) {
    this.router.navigate(['/updateFood', item.id]);
  }

  addToCart(item: Item) {
    this.cartService.addToCart(item);
    this.message = 'Added to cart';
    setTimeout(() => {
      this.message = null;
    }, 3000);

  }

}
