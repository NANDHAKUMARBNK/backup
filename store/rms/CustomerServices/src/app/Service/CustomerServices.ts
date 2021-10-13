import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class CustomerService {

	Url: string ="api/lists"
	constructor(private http: HttpClient) {

	};

	//<============ ClaimList Servicess ==================>
	getClaimList(reminderId, flagId, statusId, assignedUserId, cruiseLineId, shipId, portId, customerId) { //reminderId ,flagId ,statusId , assignedUserId ,cruiseLineId , shipId , portId , vendorId
		return this.http.get(`api/custsvc/claims?reminderId=${reminderId}&flagId=${flagId}&statusId=${statusId}&assignedUserId=${assignedUserId}&cruiseLineId=${cruiseLineId}&shipId=${shipId}&portId=${portId}&customerId=${customerId} `)
	};

	editClaim(id) {
		return this.http.get(`api/custsvc/claims/${id}`)
	}

    getClaimSearch(fName ,lName ,address1 ,address2 ,email , phonePrefix ,phoneNum) {
        return this.http.get(`api/custsvc/claims/search?fName=${fName}&lName=${lName}&address1=${address1}&address2=${address2}&email=${email}&phonePrefix=${phonePrefix}&phoneNum=${phoneNum}`);
    }

	getPersonData(claimId, personId) {
		//return this.http.get(`api/custsvc/claims?personId=${personId}`)
		return this.http.get(`api/custsvc/claimHistory?claimId=${claimId}&personId=${personId}`)
		
	}

	saveClaim(Person, addressList, contactList ) {
		return this.http.post(`api/custsvc/claims`, { Person, addressList, contactList});
	};
	UpdateNextClaim(claimId, Person, addressList, contactList, DeletedAddressList, DeletedContactList, DeletedPhoneList) {
		return this.http.put(`api/custsvc/claims/${claimId}`, { Person, addressList, contactList, DeletedAddressList, DeletedContactList, DeletedPhoneList });
	}

	saveClaimDetails(claimId, details) {
		return this.http.put(`api/custsvc/claims/${claimId}/details`,  details );
	};

	getclaimUpdate(claimId) {
		return this.http.get(`api/custsvc/claims/${claimId}/updates`)
	};

	saveclaimUpdate(claimId,updateDetails) {
		return this.http.post(`api/custsvc/claims/${claimId}/updates`, updateDetails);
	};

	updateclaimUpdate(claimId,claimUpdateId, updateDetails) {
		return this.http.put(`api/custsvc/claims/${claimId}/updates/${claimUpdateId}`, updateDetails);
	};

	geteditUpdate(claimId,claimUpdateId) {
		return this.http.get(`api/custsvc/claims/${claimId}/updates/${claimUpdateId}`)

	}
	saveDocument(section, claimId, cacheId, filename, description) {
		return this.http.post(`api/media/documents/${section}/${claimId}`, { cacheId, filename, description  });
	}
	
	//update merchant passing portid and purchase date
	getMerchantBasedOnPortIdAndPurchaseDate(portId,purchaseDate) {//cruiseLineId, shipId, portId
		
		return this.http.get(`api/lists/custsvc/claimDetails/merchants?portId=${portId}&purchaseDate=${purchaseDate}`);

	}
}