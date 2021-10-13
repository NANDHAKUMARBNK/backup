import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { FuseModule } from '../../@fuse/fuse.module';
import { FuseSharedModule } from '../../@fuse/shared.module';
import { FuseConfigService } from '../../@fuse/services/config.service';

import { MatTabsModule,  MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RMSSharedModule } from '../../common/modules/RMSSharedModule';
import { TreeModule } from 'primeng/tree';


//import { HttpErrorInterceptor } from 'common/services/HttpErrorHandling';

@NgModule({
	declarations: [
		AppComponent,
	
		//HomeComponent
	],
	imports: [
		BrowserModule,
		TreeModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatTabsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		FuseModule,
		FuseSharedModule,
		RMSSharedModule,
	],
	providers: [FuseConfigService,
		//{
		//provide: HTTP_INTERCEPTORS,
		//useClass: HttpErrorInterceptor,
		//multi: true,
		//},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
