import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CruiseLineComponent } from './Components/CruiseLineComponent';
import { CruiseLineProfileComponent } from './Components/CruiseLineProfileComponent';

const routes: Routes = [
	{ path: '', component: CruiseLineComponent },
	{path: 'Profile', component: CruiseLineProfileComponent}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CruiseLineRoutingModule { }