import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PsgListComponent } from './Components/PsgListComponent';
import { PsgProfileComponent } from './Components/PsgProfileComponent';
import { ShipAssignmentComponent } from './Components/ShipAssignment';

const routes: Routes = [
	{ path: '', component: PsgListComponent },
	{
		path: 'Profile',
		component: PsgProfileComponent
	},
	{
		path: 'Profile/ship',
		component: ShipAssignmentComponent
	},
];



@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PsgRoutingModule { }