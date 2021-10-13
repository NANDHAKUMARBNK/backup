import { Component } from '@angular/core';
import { Location } from '@angular/common'
@Component({
	selector: 'app-couponprofile',
	templateUrl:  '../../../../../../../Views/CouponBook/CouponProfile.html',
	styleUrls: [ '../../../../../../common/styles/AgGrid.scss']
})
export class CouponProfileComponent {
	CouponProfile ="CouponProfile"
		constructor(private location: Location
		) {
	}
	ngOnInIt(){}

backpage() {
	this.location.back()

}
}