import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetListComponent } from './Components/CouponTargetList';

const routes: Routes = [
	{
		path: '',
		component: TargetListComponent
	}

];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponTargetRoutingModule { }