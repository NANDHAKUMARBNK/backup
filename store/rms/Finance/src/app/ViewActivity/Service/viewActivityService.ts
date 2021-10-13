import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class ViewActivityService {

	constructor(private http: HttpClient) {

	};

	/*=========== Account Summary Start=============*/
	getParamtersAccountSummary(details) {
		return	this.http.post('api/finance/account/summary/search', details)
	};
	getParamtersDetail(details) {
		return this.http.post('api/finance/account/detail/search', details)
	};
	getParamtersHistory(details) {
		return this.http.post('api/finance/account/history/search', details)
	};
	getParamtersStatement(details) {
		return this.http.post('api/finance/account/statement/search', details)
	}
	getParamtersNotes(details) {
		return this.http.post('api/finance/account/notes/search', details)
	}

}