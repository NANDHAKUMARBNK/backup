import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class ContractService {

	url = "";
	constructor(private http: HttpClient) {

	};

	/*=============RetailerList Service Start===========*/
	getLevelRetailer() {
		return this.http.get('api/lists/retailer_level');
	};
	getPortRetailer() {
		return this.http.get('api/lists/ports');
	}

	getDataTypeRetailer() {
		return this.http.get('api/lists/retailer_dateType');
	};

	getGridRetailerList(levelId, portId, dateType, beginDate, endDate, isActive) {
		return this.http.get(`api/retailer?levelId=${levelId}&portId=${portId}&dateType=${dateType}&beginDate=${beginDate}&endDate=${endDate}&isActive=${isActive}`);
	}


	/*=============RetailerList Service End===========*/

	/*=============RetailerProfile Service Start===========*/

	getProfileRetailer(customerId) {
		return this.http.get(`api/retailer/${customerId}`)
	};

	getContractGrid(GPCustomerId) {
		return this.http.get(`api/retailer/contracts?GPCustomerId=${GPCustomerId}`)

	};


	/*=============RetailerProfile Service End===========*/


	/*=============ContractProfile Service Start===========*/

	getCategorycontract() {
		return this.http.get(`api/lists/contract/category`)
	};

	getContractType(id) {
		return this.http.get(`api/lists/contract/type?categoryId=${id}`)
	};

	saveContract(details) {
		return this.http.post(`api/retailer/contract`, details)
	};

	getupdateContract(contractId) {
		return this.http.get(`api/retailer/contract/${contractId}`)
	}

	updateContract(contractId, details) {
		return this.http.put(`api/retailer/contract/${contractId}`, details)
	}

	contractGrid(contractId) {
		return this.http.get(`api/retailer/contract/Rates/${contractId}`)
	};

	getContractHistory(contractId) {
		return this.http.get(`api/retailer/contract/history?contractId=${contractId}`)
	};
	getContractActions(GPCustomerId) {
		return this.http.get(`api/retailer/contract/actions?GPCustomerId=${GPCustomerId}`)
	};

	getApllyChildren(parentGPCustomerId,cruiseLineId,categoryId,typeId,contractId) {
		return this.http.get(`api/retailer/contract/Assignment?parentGPCustomerId=${parentGPCustomerId}&cruiseLineId=${cruiseLineId}&categoryId=${categoryId}&typeId=${typeId}&contractId=${contractId}`)
	};

	saveApplychildren(details) {
		return this.http.put(`api/retailer/contract/Assignment`, details)
	};

	contractValidation(details) {
		return this.http.post(`api/retailer/contractValidation`, details)
	}

	/*=============ContractProfile Service End===========*/



	/*==============Contract Rates Service Start =============*/
	getRatedById(contractRateId) {
		return this.http.get(`api/retailer/contract/Rate/${contractRateId}`)
	};

	getRatesCommisionType(categoryId) {
		return this.http.get(`api/lists/contractRate/commissionType?categoryId=${categoryId}`)
	}
	saveflat(details) {
		return this.http.post(`api/retailer/contract/Rate/FlatFee`, details);
	};
	savePercentage(details) {
		return this.http.post(`api/retailer/contract/Rate/Percentage`, details);
	};
	saveIncremental(details) {
		return this.http.post(`api/retailer/contract/Rate/Incremental`, details);
	};
	savePromoIncremental(details) {
		return this.http.post(`api/retailer/contract/Rate/Incremental`, details);
	};

	updateflat(contractRateId,details) {
		return this.http.put(`api/retailer/contract/Rate/FlatFee/${contractRateId}`, details);
	};
	updatePercentage(contractRateId,details) {
		return this.http.put(`api/retailer/contract/Rate/Percentage/${contractRateId}`, details);
	};
	updateIncremental(contractRateId,details) {
		return this.http.put(`api/retailer/contract/Rate/Incremental/${contractRateId}`, details);
	};
	updatePromoIncremental(contractRateId,details) {
		return this.http.put(`api/retailer/contract/Rate/Incremental/${contractRateId}`, details);
	}


	getRatesBasedType() {
		return this.http.get(`api/lists/contractRate/basedOn`)
	};

	getRatedAssignmentGrid(contractRateId,contractId) {
		return this.http.get(`api/retailer/contract/Rate/Assignment?contractRateId=${contractRateId}&contractId=${contractId}`)
	}


	uploadContractExcel(file: File, ) {
		const formData: FormData = new FormData();
		formData.append('files', file, file.name);
		return this.http.post(`api/retailer/contract/Rate/import`, formData);
	}
	/*==============Contract Rates Service End =============*/





}