import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponSettlementComponent } from './Components/CouponSettlementComponent';


const routes: Routes = [
	{
		path: '',
		component: CouponSettlementComponent
	}

];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponSettlementRoutingModule { }