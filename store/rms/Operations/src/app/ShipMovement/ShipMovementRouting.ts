import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipMovementComponent } from './Components/ShipMovement';
import { ShipMovementAissgnmentComponent } from './Components/ShipMovementAssignment';

const routes: Routes = [
	{ path: '', component: ShipMovementComponent },
	{
		path: 'Assignment',
		component: ShipMovementAissgnmentComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ShipMovementRoutingModule { }