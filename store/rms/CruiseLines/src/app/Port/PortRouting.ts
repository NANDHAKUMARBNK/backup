import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortListComponent } from './Components/PortListComponent';
import { PortProfileComponent } from './Components/PortProfileComponent';
const routes: Routes = [
	{ path: '', component: PortListComponent },
	{ path: 'Profile', component: PortProfileComponent }
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PortRoutingModule { }