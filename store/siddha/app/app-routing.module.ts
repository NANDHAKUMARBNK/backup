import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistermodelComponent } from './components/registermodel/registermodel.component';
import { VideouploadComponent } from './components/videoupload/videoupload.component';
import { DoctorvideouploadComponent } from './components/doctorvideoupload/doctorvideoupload.component';
import { SuccessComponent } from './components/success/success.component';
import { RegisterComponent } from './components/register/register.component';
import { PrivacypolicyComponent } from './components/privacypolicy/privacypolicy.component';
import { HomeV1Component } from './components/home-v1/home-v1.component';
import { CustomgraphComponent } from './components/customgraph/customgraph.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'success', component: SuccessComponent },
  {
    path: 'volunteersiddhadoctorsregistration',
    component: RegistermodelComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path:'combo',
    component:CustomgraphComponent
  },
  {
    path: 'Privacypolicy',
    component: PrivacypolicyComponent,
  },
  {
    path: 'uploadvideo',
    component: VideouploadComponent,
  },
  {
    path: 'uploaddoctorvideo',
    component: DoctorvideouploadComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
