import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'common/components/HomeComponent';
import { ErrorPageComponent } from 'common/components/ErrorPageComponentts';
import { AuthGuardService } from 'common/services/AuthGuardsService';
import { SettingComponent } from 'common/Settings/SettingComponent';
import { SettingTabComponent } from 'common/Settings/SettingTabComponent';
import { LogTabComponent } from 'common/Settings/LogTabComponent';


//import { CruiseLineComponent } from 'src/apps/CruiseLines/src/app/CruiseLine/CruiseLineComponent';
//import { PsgListComponent } from 'src/apps/Operations/src/app/PSG/PsgListComponent';

const routes: Routes = [
	{
		path: '', component: HomeComponent ,canActivate: [AuthGuardService],
		data: { role: 'User Access'  }},
	//{ path: '**', redirectTo: '/Error' }
	{
		path: 'settings', component: SettingComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Global Admin User']
		}
	},
	{
		path: 'reportadmin', component: SettingTabComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Global Admin User']
		}
	},
	{
		path: 'logsystem', component: LogTabComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Global Admin User']
		}
	},
	//{
	//	path:'category',component:SettingTabComponent
	//}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
