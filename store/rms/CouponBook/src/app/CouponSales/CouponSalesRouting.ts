import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponSalesComponent } from './Components/CouponSalesComponent';

const routes: Routes = [
	{
		path: '',
		component: CouponSalesComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponSalesRoutingModule { }