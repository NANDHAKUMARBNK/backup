import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryListComponent } from './Components/InventoryListComponent';

const routes: Routes = [
	{
		path: '',
		component: InventoryListComponent
	}

];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponInventoryRoutingModule { }