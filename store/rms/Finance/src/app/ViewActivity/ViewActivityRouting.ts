import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSummaryComponent } from './Components/AccountSummaryComponent';
import { ViewActivityTabComponent } from './Components/ViewActivityComponentTab';
import { AccountDetailComponent } from './Components/AccountDetailComponent';
import { AccountHistoryComponent } from './Components/AccountHistoryComponent';
import { AccountStatementComponent } from './Components/AccountStatementComponent';
import { AccountNotesComponent } from './Components/AccountNotesComponent';

const routes: Routes = [
    {
		path: '',
		component: ViewActivityTabComponent,
		children: [
			{
				path: '',
				component: AccountSummaryComponent
			},
			{
				path: 'AccountSummary',
				component: AccountSummaryComponent
            },
            {
				path: 'AccountDetail',
				component: AccountDetailComponent
            },
            {
				path: 'AccountHistory',
				component: AccountHistoryComponent
			},
		    {
				path: 'AccountStatement',
				component: AccountStatementComponent
            },
            {
				path: 'AccountNotes',
				component: AccountNotesComponent
			}
	
        ]
	},


]
@NgModule({

	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ViewActivityRoutingModule { }