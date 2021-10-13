import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-aggrids',
	templateUrl: '../../../../../../Views/CustomerServices/CustomLoader.html',
	styleUrls: ['../../../../../common/styles/AgGrid.scss']
})

export class CustomLoadingCellRenderer {

	 params: any;

	agInit(params): void {
		this.params = params;
	
	}
}