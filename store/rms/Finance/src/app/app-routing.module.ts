import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'common/services/AuthGuardsService';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';

const routes: Routes = [
  {
		path: 'Retailer',
		loadChildren: './Retailer/RetailerModule#RetailerModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Finance Contract Admin', 'Global Admin']
		}
  },
  {
		path: 'Management',
		loadChildren: './Management/ManagementModule#ManagementModule',
		canActivate: [AuthGuardService], 
				data: {
					role: ['User Access', 'Finance Operations', 'Finance Sales Admin', 'Global Admin']
			}
  },
  {
		path: 'ViewActivity',
		loadChildren: './ViewActivity/ViewActivityModule#ViewActivityModule'
	},
	{ path: 'Error', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
