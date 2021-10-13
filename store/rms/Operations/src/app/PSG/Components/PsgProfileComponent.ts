import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-psgProfile',
	templateUrl: '../../../../../../../Views/Operations/PsgProfile.html',
	styleUrls: ['../../../styles/PsgList.scss',]
})
export class PsgProfileComponent {

	constructor(private location: Location, private router: Router) { }
	psgName = "PSG"
}
