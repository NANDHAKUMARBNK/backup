import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PsgProfileComponent } from './PSG/Components/PsgProfileComponent';
import { ShipAssignmentComponent } from './PSG/Components/ShipAssignment';
import { ShipMovementAissgnmentComponent } from './ShipMovement/Components/ShipMovementAssignment';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';


const routes: Routes = [
	{
		path: 'PSG',
		loadChildren: './PSG/PsgModule#PSGModule', canActivate: [AuthGuardService],
		data: {
			role:[ 'User Access' , 'PSG Admin Role' , 'Global Admin']
		}
	},
	{
		path: 'RMM',
		loadChildren: './RMM/RmmModule#RMMModule', canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'PSG Admin Role', 'Global Admin']
		}
	},
	{
		path: 'ShipMovement',
		loadChildren: './ShipMovement/ShipMovementModule#ShipMovementModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'PSG Admin Role', 'Global Admin']
		}
	},
	//{ path: '**', redirectTo: '/Error' },
	{ path: 'Error', component: ErrorPageComponent },


];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
