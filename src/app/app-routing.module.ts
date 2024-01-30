import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {MenuComponent} from "./components/menu/menu.component";
import {LoginComponent} from "./components/login/login.component";
import {AddFoodComponent} from "./components/add-food/add-food.component";
import {UpdateFoodComponent} from "./components/update-food/update-food.component";
import {AuthGuard} from "./guard/auth.guard";
import {CartService} from "./services/cart.service";
import {CartComponent} from "./components/cart/cart.component";
import {OrdersComponent} from "./components/orders/orders.component";

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'menu', component:MenuComponent},
  {path:'login', component:LoginComponent},
  {path:'updateFood/:id', component:UpdateFoodComponent, canActivate: [AuthGuard]},
  {path: 'addFood', component: AddFoodComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent},
  {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
