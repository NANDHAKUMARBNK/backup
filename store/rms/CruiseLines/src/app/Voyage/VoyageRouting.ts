import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoyageListComponent } from './Components/VoyageListComponent';
import { VoyageProfileComponent } from './Components/VoyageProfilecomponent';

const routes: Routes = [
	{ path: '', component: VoyageListComponent },
	{path: 'Profile' , component:VoyageProfileComponent}
];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VoyageRoutingModule { }