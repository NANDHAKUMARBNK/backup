import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetListComponent } from './Components/BudgetListComponent';
const routes: Routes = [
	{
		path: '',
		component: BudgetListComponent
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CouponBudgetRoutingModule { }