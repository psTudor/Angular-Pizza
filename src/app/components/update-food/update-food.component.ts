import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ItemService } from "../../services/item.service";
import { Item } from "../../models/item";


@Component({
    selector: 'app-update-item',
    templateUrl: './update-food.component.html',
    styleUrls: ['./update-food.component.css']
})

export class UpdateFoodComponent implements OnInit {
    updateForm: FormGroup;
    currentItemId: string | undefined;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.updateForm = new FormGroup({
            name: new FormControl(''),
            price: new FormControl(''),
            cookTime: new FormControl(''),
            imageURL: new FormControl('')
        });

        this.route.params.subscribe(params => {
            this.currentItemId = params['id'];
        });
    }

    ngOnInit(): void {
      this.currentItemId = this.route.snapshot.params['id'];
      if (this.currentItemId) {
        this.itemService.getItem(this.currentItemId).subscribe(item => {
          if (item) {
            this.updateForm.patchValue({
                name: item.name,
                price: item.price,
                cookTime: item.cookTime,
                imageURL: item.imageURL
            });
          }
        });
      }
    }

    onUpdate() {
        if (this.updateForm.valid && this.currentItemId) {
            const updatedItem: Item = {
                id: this.currentItemId,
                ...this.updateForm.value
            };

            this.itemService.update(updatedItem).then(() => {
                // Dacă actualizarea a reușit, navighează înapoi la lista de items sau la o pagină de confirmare
                this.router.navigate(['/menu']);
            }).catch(error => {
                // Gestionarea erorilor
                console.error(error);
            });
        }
    }
}
