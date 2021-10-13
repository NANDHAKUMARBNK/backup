import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AffidavitComponent } from './Components/AffidavitComponent';
import { AffidavitTabComponent } from './Components/AffidavitTabComponent';
import { ManagementSalesComponent } from './Components/SalesComponent';
import { SalesInvoiceComponent } from './Components/SalesInvoiceComponent';
import { ManagementHistoryComponent } from './Components/ManagementHistoryComponent';
import { AuthGuardService } from 'common/services/AuthGuardsService';
import { ManagementSalesV2Component } from './Components/SalesComponentV2';
const routes: Routes = [

	{
		path: '',
		component: AffidavitTabComponent,
		canActivate: [AuthGuardService],
		data: {
			role: ['User Access', 'Finance Operations','Finance Sales Admin', 'Global Admin']
		},
		children: [
			{
				path: '',
				component: AffidavitComponent,
				canActivate: [AuthGuardService],
				data: {
					role: ['User Access', 'Finance Operations', 'Global Admin']
				}
			},

			{
				path: 'Affidavit',
				component: AffidavitComponent,
				canActivate: [AuthGuardService],
				data: {
					role: ['User Access', 'Finance Operations', 'Global Admin']
				}
			},
			{
				path: 'sales',
				component: ManagementSalesV2Component,
				canActivate: [AuthGuardService],
				data: {
					role: ['User Access', 'Finance Sales Admin', 'Global Admin']
				}
			},
			{
				path: 'invoice',
				component: SalesInvoiceComponent,
				canActivate: [AuthGuardService],
				data: {
					role: ['User Access', 'Finance Operations', 'Global Admin']
				}
			},
			{
				path: 'history',
				component: ManagementHistoryComponent,
				canActivate: [AuthGuardService],
				data: {
					role: ['User Access', 'Finance Operations', 'Global Admin']
				}
			}
		]
	},


]
@NgModule({

	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ManagementRoutingModule { }