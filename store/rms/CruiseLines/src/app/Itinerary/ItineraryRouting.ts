import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItineraryWagesComponent } from './Components/ItineraryWagesComponent';


const routes: Routes = [
	{path: '', component: ItineraryWagesComponent}
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ItineraryRoutingModule { }