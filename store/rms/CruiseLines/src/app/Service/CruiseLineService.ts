import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class CruiseLineService {

	url = "api/cruiseLine"
	constructor(private http: HttpClient) {

	};
	// <===========  CruiseLine Service Start===============>
	getCruiseLineList() {
		return this.http.get(`${this.url}/cruiselines`);
		//return this.http.get('api/error/404')
	};
	getCruiseLineProfile(id) {
		return this.http.get(`${this.url}/cruiselines/${id}`)
	};
	getFeeGrid(cruiseLineId) {
		return this.http.get(`${this.url}/cruiselineFees?cruiseLineId=${cruiseLineId}`);
	};
	checkOverlapDate(cruiseLineId, descTypeId, startDate, endDate) {
		return this.http.get(`api/cruiseLine/existingFee?cruiseLineId=${cruiseLineId}&descTypeId=${descTypeId}&startDate=${startDate}&endDate=${endDate}`);
	}
	saveAddFee(details) {
		return this.http.post(`${this.url}/cruiselineFee`, details)
	};
	getUpdateId(id) {
		return this.http.get(`${this.url}/cruiselineFees/${id}`);
	}
	updateAddFee(id, details) {

		return this.http.put(`${this.url}/cruiseLineFee/${id}`, details)

	}

	// <===========  CruiseLine Service End===============>


	// <===========  Ship Service Start===============>



	getShipGridList(statusId, cruiseLineId) {
		return this.http.get(`${this.url}/ships?statusId=${statusId}&cruiseLineId=${cruiseLineId}`);
	};
	getShipPorfileId(id) {
		return this.http.get(`${this.url}/ships/${id}`)
	};
	getShipProfileGift() {
		return this.http.get('api/lists/ship/ShopConcessionaire')
	}
	saveShipProfile(shipId, details) {
		return this.http.put(`${this.url}/ships/${shipId}`, details);
	}


	// <===========  Ship Service End===============>


	// <===========  Voyage  Service Start===============>
	listUrl = "api/lists"
	getVoyagesShip(id) {
		//return this.http.get(`api/cruiseLine/voyages/ship`);
		return this.http.get(`${this.listUrl}/ships?cruiseLineId=${id}`);
	};
	getVoyagesPorts(id) {
		return this.http.get(`api/cruiseLine/CruiseLine_ports?shipId=${id}`);
	}
	getVoyagesGrid(cruiseLineId, shipId, regionId, portId, embarkStartDate, embarkEndDate, debarkStartDate, debarkEndDate) {
		return this.http.get(`${this.url}/voyages?cruiseLineId=${cruiseLineId}&shipId=${shipId}&regionId=${regionId}&portId=${portId}&embarkStartDate=${embarkStartDate}&embarkEndDate=${embarkEndDate}&debarkStartDate=${debarkStartDate}&debarkEndDate=${debarkEndDate}`);
	};
	getVoyagesProfileById(id) {
		return this.http.get(`api/cruiseLine/voyageDetailSequence/${id}`);
	};
	getVoyageType() {
		return this.http.get(`api/lists/voyageDetailSequence/Type`);
	};
	deleteVoyagesProfile(voyageId) {
		return this.http.delete(`api/cruiseLine/Deletevoyage?voyageId=${voyageId}`)
	};
	saveVoyagesProfile(id, typeId, regionId) {
		return this.http.put(`api/cruiseLine/voyageDetailSequence/${id}?typeId=${typeId}&regionId=${regionId}`, {})
	};

	getVoyageWagesNotSetup(itineraryId) {
		return this.http.get(`api/cruiseLine/voyageWages/${itineraryId}`);
	}

	getVoyageProfileGrid(id) {
		return this.http.get(`api/cruiseLine/itinerarySequence?voyageId=${id}`)
	};
	getLocation() {
		return this.http.get(`api/lists/ports`);
	}
	deleteProfileGrid(itinerarySequenceId) {
		return this.http.delete(`api/cruiseLine/deleteVoyageDetailSequence?itinerarySequenceId=${itinerarySequenceId}`)
	};
	saveProfileGrid(details) {
		return this.http.post(`api/cruiseLine/itinerarySequence`, details)
	};
	updateProfileGrid(id, detilas) {
		return this.http.put(`api/cruiseLine/itinerarySequence/${id}`, detilas)
	}
	shoppingExpert(shoppingExpertcruiseLineId, shipId, embarkDateTime) {
		return this.http.get(`api/cruiseLine/voyageDetailSequence/shoppingExpert?cruiseLineId=${shoppingExpertcruiseLineId}&shipId=${shipId}&embarkDateTime=${embarkDateTime}`);
	};

	getGridDeletePop(itinerarySequenceId,voyageId) {
		return this.http.get(`api/cruiseLine/voyageDetailSequence/delete?itinerarySequenceId=${itinerarySequenceId}&voyageId=${voyageId}`)
	};

	continueDelete(itinerarySequenceId){
		return this.http.delete(`api/cruiseLine/DeletevoyageDetailSequence?itinerarySequenceId=${itinerarySequenceId}`)
	};

	refreshGridById(id){
		return this.http.get(`api/cruiseLine/itinerarySequence/${id}`)
	};

	getVoyageHistory(voyageId,itinerarySequenceId,requestVersion){
		return this.http.get(`api/cruiseLine/voyage/history?voyageId=${voyageId}&itinerarySequenceId=${itinerarySequenceId}&requestVersion=${requestVersion}`)
	}

	

	// <===========  Voyage  Service End===============>



	// <===========  Port  Service Start===============>

	getPortGridList(countryId, isActiveProgram) {
		return this.http.get(`${this.url}/CruiseLine_ports?countryId=${countryId}&isActiveProgram=${isActiveProgram}`);
	};
	getPortProfileId(id) {
		return this.http.get(`${this.url}/CruiseLine_ports/${id}`)
	};
	savePortDetail(PortId, details) {
		return this.http.put(`${this.url}/cruiseLinePort/${PortId}`, details)
	};
	getPortDetilGrid(parentPortId) {
		return this.http.get(`${this.url}/portsMapped/${parentPortId}`)

	}
	// <===========  Port  Service End===============>




	//==============Wages Service Start ===================>

	getWagesGridList(entityId, wagesSetupId) {
		return this.http.get(`${this.url}/cruiselines_itinerarywage?entityId=${entityId}&isWagesAvail=${wagesSetupId}`);

	};
	updateData(Id, dailyRate) {
		return this.http.put(`${this.url}/cruiseLineItenirary/${Id}?dailyRate=${dailyRate}`, {})
	};
	getWagesHistoryGrid(itineraryID) {
		return this.http.get(`${this.url}/cruiselines_itinerarywage_history/${itineraryID}`);
	}




	//==============Wages Service End ===================>

}