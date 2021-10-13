import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';

const routes: Routes = [
	{
		path: 'CouponBooks',
		loadChildren: './Coupon/CouponBookModule#CouponBookModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Collateral Admin Role', 'Global Admin']
		}
	},
	
	{
		path: 'CouponInventory',
		loadChildren: './CouponInventory/CouponInventoryModule#CouponInventoryModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Collateral Admin Role', 'Global Admin']
		}

	},
	{
		path: 'CouponBudget',
		loadChildren: './CouponBudget/CouponBudgetModule#CouponBudgetModule'
	},
	{
		path: 'CouponTarget',
		loadChildren: './CouponTarget/CouponTargetModule#CouponTargetModule'
	},
	{
		path: 'CouponSales',
		loadChildren: './CouponSales/CouponSalesModule#CouponSalesModule'
	},
	{ 
		path: 'CouponSettlement',
		loadChildren: './CouponSettlement/CouponSettlementModule#CouponSettlementModule'
	},
	//{ path: '**', redirectTo: '/Error' },
	{ path: 'Error', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
