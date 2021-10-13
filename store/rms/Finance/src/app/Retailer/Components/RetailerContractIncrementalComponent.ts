import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//import { Location } from '@angular/common';

@Component({
	selector: 'app-contractinc',
	templateUrl: '../../../../../../../Views/Finance/ContractIncremental.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss']
})

export class ContractIncrementalComponent {
	incrementalForm: FormGroup;
	constructor(private http: HttpClient,private router:Router, private route: ActivatedRoute, private fb: FormBuilder) {
	}

	ngOnInit() {
		//  this.router.events.subscribe((evt) => {
        //     if (!(evt instanceof NavigationEnd)) {
        //         return;
        //     }
        //     window.scrollTo(0, 0)
        // });

		this.incrementalForm = this.fb.group({
			levelOneCheck: [''],
			levelOnemin: [''],
			levelOnemax: [''],
			levelOnepercentage: [''],
			levelTwoCheck: [''],
			levelTwomin: [''],
			levelTwomax: [''],
			levelTwopercentage: [''],
			levelThreeCheck: [''],
			levelThreemin: [''],
			levelThreemax: [''],
			levelThreepercentage: [''],
			levelFourCheck: [''],
			levelFourmin: [''],
			levelFourmax: [''],
			levelFourpercentage: [''],
		})
	};

	validateMoneyFormat(event) {
	
		var t = event.target.value;
		event.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
	}

	levelOneCheckChange(event) {
	
		if (event.target.checked == true) {
			this.incrementalForm.get('levelOnemax').setValidators([Validators.required]);
			this.incrementalForm.get('levelOnepercentage').setValidators([Validators.required]);
		} else {
			this.incrementalForm.get('levelOnemin').setValidators(null);
			this.incrementalForm.get('levelOnemax').setValidators(null);
			this.incrementalForm.get('levelOnepercentage').setValidators(null);
		}
	};

	levelTwoCheckChange(event) {
		if (event.target.checked == true) {
			this.incrementalForm.get('levelTwomin').setValidators([Validators.required]);
			this.incrementalForm.get('levelTwomax').setValidators([Validators.required]);
			this.incrementalForm.get('levelTwopercentage').setValidators([Validators.required]);
		} else {
			this.incrementalForm.get('levelTwomin').setValidators(null);
			this.incrementalForm.get('levelTwomax').setValidators(null);
			this.incrementalForm.get('levelTwopercentage').setValidators(null);
		}
	};
	levelThreeCheckChange(event) {
		if (event.target.checked == true) {
			this.incrementalForm.get('levelThreemin').setValidators([Validators.required,]);
			this.incrementalForm.get('levelThreemax').setValidators([Validators.required]);
			this.incrementalForm.get('levelThreepercentage').setValidators([Validators.required]);
		} else {
			this.incrementalForm.get('levelThreemin').setValidators(null);
			this.incrementalForm.get('levelThreemax').setValidators(null);
			this.incrementalForm.get('levelThreepercentage').setValidators(null);
		}
	};
	levelFourCheckChange(event) {
		if (event.target.checked == true) {
			this.incrementalForm.get('levelFourmin').setValidators([Validators.required]);
			this.incrementalForm.get('levelFourmax').setValidators([Validators.required]);
			this.incrementalForm.get('levelFourpercentage').setValidators([Validators.required]);
		} else {
			this.incrementalForm.get('levelFourmin').setValidators(null);
			this.incrementalForm.get('levelFourmax').setValidators(null);
			this.incrementalForm.get('levelFourpercentage').setValidators(null);
		}
	};

}