﻿import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog, } from "@angular/material";
import { FormControl } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { Router, NavigationEnd } from '@angular/router';


//import { Location } from '@angular/common';

@Component({
	selector: 'app-checkboxcontractchildren',
	template: `<div> <input type="checkbox" (change)="checkbox($event, data)">  </div>`,
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class CheckBoxChildrenComponent {
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any;
	locationCheck = new FormControl(false);

	constructor(
		private emitterService: EmitterService,  private rMSApiService: RMSApiService

	) {

	}
	agInit(params) {
		this.data = params.data;
	};

	checkbox(e, data) {
	
		let tempArray = this.rMSApiService.getData();

		if (e.target.checked == true) {
			//here we need to push the id
			tempArray.push(data);
		} else if (e.target.checked == false) {
			tempArray = tempArray.filter(element => element.id != data.id)
			//here we need to pop based on id
		}
	
		this.rMSApiService.setData(tempArray);
	}

}

