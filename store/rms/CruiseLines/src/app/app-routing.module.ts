import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';

const routes: Routes = [
	{
		path: 'CruiseLine',
		loadChildren: './CruiseLine/CruiseLineModule#CruiseModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Cruise Line Admin Role', 'Global Admin','Business Super Admin']
		}
	},
	{
		path: 'Ship',
		loadChildren: './Ship/ShipModule#ShipModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Cruise Line Admin Role', 'Global Admin']
		}
	},
	{
		path: 'Voyage',
		loadChildren: './Voyage/VoyageModule#VoyageModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Cruise Line Admin Role', 'Global Admin']
		}
	},
	{
		path: 'Port',
		loadChildren: './Port/PortModule#PortModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Cruise Line Admin Role', 'Global Admin']
		}
	},
	{
		path: 'ItineraryWage',
		loadChildren: './Itinerary/ItineraryModule#ItineraryModule',
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Cruise Line Admin Role', 'Global Admin']
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
