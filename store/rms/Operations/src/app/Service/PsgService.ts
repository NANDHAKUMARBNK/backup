import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PsgService {
	constructor(private http: HttpClient) { }

	//PsgList Grid Service
	getpsgListGrid(statusId, cruiseLineId, shipId, rmmManagerId, isactive) {
		//return this.http.get(`api/operations/psg?vendorIds=${vendorId}&statusIds=${statusId}`)
		return this.http.get(`api/operations/psg?statusId=${statusId}&cruiseLineId=${cruiseLineId}&shipId=${shipId}&rmmId=${rmmManagerId}&isActive=${isactive}`);
	}
	//PsgProfile getid  Service
	getProfile(id) {
		return this.http.get(`api/operations/psg/${id}`);
	}
	//PsgProfile Save profile  Service
	saveProfile(id, statusId) {
		return this.http.put(`api/operations/psg/${id}?statusId=${statusId}`, {});
	};
	//Phone profile Display
	getPsgProfilePhone(vendorId) {
		return this.http.get(`api/operations/psgphone/${vendorId}`)
	}
	//Psg ShipAssigment Grid Service
	getShipAssigment(id) {
		return this.http.get(`api/operations/psg/${id}/shipAssignments`);
	};
	//Psg ShipAssigment GetId Service
	getShipAssignmentId(vendorId, id) {
		return this.http.get(`api/operations/psg/${vendorId}/shipAssignments/${id}`);
	};
	//Get embarkdate Service
	getembarkDate(shipId, filterDate) {
		return this.http.get(`api/common/ships/${shipId}/embarkDates?filterDate=${filterDate}`);
	};
	//Get disbarkdate Service
	getdisembarkDate(shipId, filterDate) {
		return this.http.get(`api/common/ships/${shipId}/disembarkDates?filterDate=${filterDate}`);
	};
	//Post saveSipAssignemt Service
	saveShipAssignment(shipId, reqData) {
		return this.http.post(`api/operations/psg/shipAssignments/${shipId}`, reqData);
	};
	//Post UpdateSipAssignemt Service
	updateShipAssignment(vendorAssignmentId, shipId, reqData) {
		return this.http.put(`api/operations/psg/${vendorAssignmentId}/shipAssignments/${shipId}`, reqData);
	};

	//RMM COMPONENT SERVICE

	//RmmListGrid Service
	getRmmGrid() {
		return this.http.get('api/operations/rmm');
	};
	//Get RMM Dropdownlist Service
	getDropdownlistGrid() {
		return this.http.get('api/operations/rmm/vendors');
	};
	//Save RmmList Service
	saveRmmList(entityId, vendorId) {
		return this.http.post(`api/operations/rmm/vendors/${entityId}/${vendorId}`, {});
	};


	//<==========ShipMovement Service============>
	getShipsMovement(cruiseLineId){
	return	this.http.get(`api/lists/shipAssignment/ships?cruiseLineId=${cruiseLineId}`)
	}
	searchList(cruiseLineId, shipId, staffTypeId) {
		return this.http.get(`api/operations/psg/shipMovement?cruiseLineId=${cruiseLineId}&shipId=${shipId}&staffTypeId=${staffTypeId}`);
	};
	saveAddShipMovement(shipId,details) {
		return this.http.post(`api/operations/psg/shipMovement/${shipId}`, details)
	};
	getShipMovementId(id) {
		return this.http.get(`api/operations/psg/shipMovement/${id}`);
	};
	UpdateShipMovement(vendorAssignmentId, shipId, reqData) {
		return this.http.put(`api/operations/psg/${vendorAssignmentId}/shipMovement/${shipId}`, reqData);

	}
}