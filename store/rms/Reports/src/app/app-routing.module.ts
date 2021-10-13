import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTreeComponent } from './Components/ReportTreeComponent';
import { ReportProfileComponent } from './Components/ReportProfileComponent';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';

const routes: Routes = [
	{
		path: '',
		component: ReportTreeComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access']
		}
	},
	{
		path: 'profile',
		component: ReportProfileComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access']
		}
	},
	{ path: 'Error', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
