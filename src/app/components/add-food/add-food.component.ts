import { Component } from '@angular/core';
import { ItemService } from "../../services/item.service";
import { Item } from "../../models/item";


@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})
export class AddFoodComponent {
  item: Item = new Item();
  submitted = false;

  constructor(private itemService: ItemService) {}

  saveItem(): void {
    this.itemService.create(this.item).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newItem() {
    this.submitted = true;
    this.item = new Item();
  }

}
