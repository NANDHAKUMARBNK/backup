import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetailerListComponent } from './Components/RetailerListComponent';
import { RetailerProfileComponent } from './Components/RetailerProfileComponent';
import { RetailerContractComponent } from './Components/RetailerContractComponent';
import { ContractRateFlatComponent } from './Components/ContractRateFlatComponent';
import { ContractIncrementalComponent } from './Components/RetailerContractIncrementalComponent';
import { RatePercentageComponent } from './Components/RatePercentageComponent';

const routes: Routes = [
	{
		path: '',
		component: RetailerListComponent
	},
	{ path: 'Profile', component: RetailerProfileComponent },
	{ path: 'Contract', component: RetailerContractComponent },
	{ path: 'Rates', component: ContractRateFlatComponent },
	{
		path: 'ContractInc', component: ContractIncrementalComponent
	},
	{
		path: 'RatePercentage', component: RatePercentageComponent
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RetailerRoutingModule { }