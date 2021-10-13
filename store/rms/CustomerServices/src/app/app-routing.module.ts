import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimListComponent } from './Components/ClaimListComponent';
import { TabsComponent } from './Components/TabsComponent';
import { ClaimAddEitComponent } from './Components/ClaimAddEditComponent';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';

const routes: Routes = [
	{
		path: '',
		component: ClaimListComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access' , 'Customer Service User Role' , 'Global Admin']
		}
	},
	{
		path: 'Claim',
		component: TabsComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Customer Service User Role', 'Global Admin']
		}
	},
	//{ path: '**', redirectTo: '/Error' },
	{ path: 'Error', component: ErrorPageComponent },
		//children: [
		//	{ path: '', redirectTo: 'ClaimAdd', pathMatch: 'full' },
		//	{
		//		path: 'ClaimAdd',
		//		component: ClaimAddEitComponent
		//	}
		//]

	

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
