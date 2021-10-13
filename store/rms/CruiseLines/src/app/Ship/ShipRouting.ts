import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipListComponent } from './Components/ShipListComponent';
import { ShipProfileComponent } from './Components/ShipProfileComponent';

const routes: Routes = [
	{ path: '', component: ShipListComponent },
	{ path: 'Profile', component: ShipProfileComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	bootstrap: []
})
export class ShipRoutingModule { }