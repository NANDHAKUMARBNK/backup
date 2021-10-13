import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponBookListComponent } from './Components/CouponBookListComponent';
import { CouponProfileComponent } from './Components/CouponProfileComponent';

const routes: Routes = [
	{
		path: '',
		component: CouponBookListComponent
	},
	{path: 'Profile' , 
	component:CouponProfileComponent}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponBookRoutingModule { }