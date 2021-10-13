import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AgGridModule } from 'ag-grid-angular';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CouponBookRoutingModule } from './CouponBookRouting';
import { CouponBookListComponent } from './Components/CouponBookListComponent';
import { CouponProfileComponent } from './Components/CouponProfileComponent';
import { CouponGridComponent } from './Components/CouponGridComponent';
import { CouponDetailComponent } from './Components/CouponDetailComponent';
import { CouponDatesComponent } from './Components/CouponDatesComponent';
import { EffectiveStartComponent } from './Components/effectiveStartDateComponent';
import { EffectiveEndComponent } from './Components/EffectiveEndComponent';
import { CheckBoxComponent } from './Components/checkbox';
import { CouponDetailInputEditorComponent } from './couponbookinputComponent';

@NgModule({
	declarations: [
		CouponBookListComponent,
		CouponProfileComponent,
		CouponGridComponent,
		CouponDetailComponent,
		CouponDatesComponent,
		EffectiveStartComponent,
		EffectiveEndComponent,
		CheckBoxComponent,
		CouponDetailInputEditorComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CouponBookRoutingModule,
		AgGridModule,
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ToastModule
	],
	entryComponents: [CouponDatesComponent, CouponGridComponent, EffectiveStartComponent, EffectiveEndComponent, CheckBoxComponent,CouponDetailInputEditorComponent],
	exports: [RouterModule],
	bootstrap: []
})
export class CouponBookModule { }
