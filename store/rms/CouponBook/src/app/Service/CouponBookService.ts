import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class CouponBookService {

	url = "api/coupons"
	constructor(private http: HttpClient) {
	}

	//<-------Coupon Book Service start-------> //

	/* ========= Coopon book list service  start ==============*/
	getcouponbookStatus() {
		return this.http.get(`api/lists/statuses/collateral`)
	}
	getcouponBookList(statusId,cruiseLineId) {
		return this.http.get(`${this.url}/collateral?statusId=${statusId}&cruiseLineId=${cruiseLineId}`)
	};
	getListProfileById(id) {
		return this.http.get(`${this.url}/collateral/${id}`)
	};
	getStatusCollateral() {
		return this.http.get('api/lists/statuses/collateral')
	}
	saveListProfile(details) {
		return this.http.post(`${this.url}/collateral`, details)
	};
	putListProfile(id, details) {
		return this.http.put(`${this.url}/collateral/${id}`, details)
	};
	getProfileLoactionGrid(itemId, cruiseLineId) {
		return this.http.get(`${this.url}/collateral_location?itemId=${itemId}&cruiseLineId=${cruiseLineId}`)
	};
	saveCheckBox(id, itemId, locationId,isactive,GPCode) {
		return this.http.put(`${this.url}/collateral_location/${id}?itemId=${itemId}&locationId=${locationId}&isActive=${isactive}&GPCode=${GPCode}`, {})
	};

	getDateNames(id) {
        return this.http.get(`${this.url}/collateralDates/profile?itemLocationId=${id}`)
	};

	getProfileDatesGrid(id) {
        return this.http.get(`${this.url}/collateralDates?itemLocationId=${id}`)
	};
	saveDate(SaveCollateralItemLocationEffectiveDateRQ) {
		return this.http.post(`${this.url}/collateralEffectiveDates`, SaveCollateralItemLocationEffectiveDateRQ, {})
	};
	updateDate(id, effectiveStartDate, effectiveEndDate, itemLocationId) {
		return this.http.put(`${this.url}/collateralEffectiveDate/${id}?effectiveStartDate=${effectiveStartDate}&effectiveEndDate=${effectiveEndDate}&itemLocationId=${itemLocationId}`, {})
	}

	/* ========= Coopon book list service End ==============*/

	/* ========= Coopon book Inventory service  start ==============*/

	//LocationList Service
	getLocationList() {
		return this.http.get(`api/lists/collateral/locations`);
	}

	//Inventory Item List Service
	getinventoryItemList() {
		return this.http.get(`api/coupons/collateral/inventory`);
	};


	getDatesValidation() {
		return this.http.get(`api/coupons/collateral/inventory`);
	}

	//Transaction type List Service
	gettransactionTypeList() {
		return this.http.get(`api/lists/collateralTransactionType`);
	}

	//Show result List Service
	getshowResultList() {
		return this.http.get(`api/lists/collateralShowResults`);
	};
	getListSearch(locationId, itemId, typeId, showTypeId) {
		return this.http.get(`${this.url}/collateralInventory?locationId=${locationId}&itemId=${itemId}&typeId=${typeId}&showTypeId=${showTypeId}`)
	};
	getinventoryById(id) {
		return this.http.get(`${this.url}/CouponBook/${id}`)
	};
	getInventoryItem() {
		return this.http.get(`${this.url}/collateralTransfer`);
	};
	getInventoryType() {
		return this.http.get(`api/lists/collateralTransactionType`);
	};
	getInventeryDatesValidation(itemId) {
		return this.http.get(`api/coupons/collateral/${itemId}`);
	}
	getInventoryForm(itemId) {
		return this.http.get(`${this.url}/collateral_location/InventoryTransfer?itemId=${itemId}`);
	};
	getInventoryTo(itemId) {
		return this.http.get(`${this.url}/collateral_location/InventoryTransfer?itemId=${itemId}`);
	};
	SaveTranfer(details) {
		return this.http.post(`${this.url}/CollateralInventoryTransfer`, details)
	};
	updateTransfer(id, details) {
		return this.http.put(`${this.url}/CouponBook${id}`, details)
	};


	/* ========= Coopon book Inventory service  end ==============*/


	/* ========= Coopon book Budget service Start  ==============*/
	getBudgetProfile() {
		return this.http.get(`${this.url}/collateralBudget/profile`);
	};
	getbudgetListGrid(cruiseLineId, shipId, beginDate, endDate, profileId, budgetExist) {
		return this.http.get(`${this.url}/collateralBudget?cruiseLineId=${cruiseLineId}&shipId=${shipId}&beginDate=${beginDate}&endDate=${endDate}&profileId=${profileId}&budgetExist=${budgetExist}`);
	};
	putBidgetList(id, profileId, entityId, shipId, budgetdetails) {
		//let data = JSON.stringify(requestData);

		//const formData = new FormData();
		//formData.append('budgetDetails', data);

		return this.http.put(`${this.url}/collateralBudget/${id}?profileId=${profileId}&entityId=${entityId}&shipId=${shipId}`, budgetdetails) 
	};

	savebudget(details) {
		return this.http.post(`${this.url}/collateralBudgetDates`, details)
	};

	uploadBudgetExcel(file: File, profileId) {
		const formData: FormData = new FormData();
		formData.append('files', file, file.name);
		return this.http.post(`api/coupons/collateral/budget/import?profileId=${profileId}`, formData);
	}

	/* ========= Coopon book Budget service  End ==============*/


	/* ========= Coopon book Target service Start  ==============*/


	getTargetProfile() {
		return this.http.get(`${this.url}/collateralTarget/profile`);
	};
	getTargetListGrid(cruiseLineId, shipId, beginDate, endDate, profileId, budgetExist) {
		return this.http.get(`${this.url}/collateralTarget?cruiseLineId=${cruiseLineId}&shipId=${shipId}&beginDate=${beginDate}&endDate=${endDate}&profileId=${profileId}&budgetExist=${budgetExist}`);
	};

	putTargetList(id, profileId,entityId,shipId, targetDetails) {
		return this.http.put(`${this.url}/collateralTarget/${id}?profileId=${profileId}&entityId=${entityId}&shipId=${shipId}`, targetDetails)
	}

	saveTarget(details) {
		return this.http.post(`${this.url}/collateralTargetDates`, details)
	};

	uploadTargetExcel(file: File, profileId) {
		const formData: FormData = new FormData();
		formData.append('files', file, file.name);
		return this.http.post(`api/coupons/collateral/target/import?profileId=${profileId}`, formData);
	}
	/* ========= Coopon book Target service End  ==============*/


	/* ========= Coopon book Sales service Start  ==============*/
	getShipsSales(cruiseLineId) {
		return this.http.get(`api/lists/collateral/ships?cruiseLineId=${cruiseLineId}`)
	};

	getShowResults() {
		return	this.http.get(`api/lists/collateralSales`)
	}
	getSalesList(cruiseLineId, shipId, voyageStartDate, voyageEndDate, voyageId, settledTypeCode) {
		return this.http.get(`${this.url}/collateralSales?cruiseLineId=${cruiseLineId}&shipId=${shipId}&voyageStartDate=${voyageStartDate}&voyageEndDate=${voyageEndDate}&voyageId=${voyageId}&settledTypeCode=${settledTypeCode}`);
	};
	getEntryById(salesId, cruiseLineId, shipId, voyageStartDate, voyageEndDate) {
		return this.http.get(`${this.url}/collateralSalesEntry?salesId=${salesId}&cruiseLineId=${cruiseLineId}&shipId=${shipId}&voyageStartDate=${voyageStartDate}&voyageEndDate=${voyageEndDate}`);

	}
	saveEntry(salesId,details) {
		return this.http.put(`${this.url}/collateralSalesEntry/${salesId}`, details)

	}


	/* ========= Coopon book Sales service End  ==============*/


	/* ========= Coopon book Settlement service Start  ==============*/
	getShowResultsSettlement() {
		return this.http.get(`api/lists/collateralSettlement_showResult`)
	};
	getSettlementList(cruiseLineId, shipId, voyageStartDate, voyageEndDate, settledTypeCode) {
		return this.http.get(`${this.url}/collateralSettlemet_target?cruiseLineId=${cruiseLineId}&shipId=${shipId}&voyageStartDate=${voyageStartDate}&voyageEndDate=${voyageEndDate}&settledTypeCode=${settledTypeCode}`);
	};

	getSettlementById(id) {
		return this.http.get(`${this.url}/collateralSettlemet_target/${id}`);
	};

	saveSettlementEntry(settlementEntry) {
		return this.http.put(`${this.url}/collateralSettlementEntry`, settlementEntry )

	}



	/* ========= Coopon book Settlement service End  ==============*/





};

