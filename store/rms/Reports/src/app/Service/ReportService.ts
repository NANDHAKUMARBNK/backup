import { Injectable } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { RMSApiService } from 'common/services/RMSApiService';

@Injectable({
	providedIn: 'root'
})
export class ReportsService {
	constructor(private http: HttpClient, private rMSApiService: RMSApiService) {
	}



	/*========= ReportsTreeService Start ============*/
	getReports() {
		return this.http.get('api/reports/tree');
		//.toPromise()
		//.then(res => <TreeNode[]>res.json().data);
	};

	getReportsId(id) {
		return this.http.get(`api/reports/${id}`)
	};
	getReportsSuceessPage(){
		return this.http.get('api/reports/reportServerConnectivity')
	}
	getReportProfile(id, requestOBJ) {
		return this.http.post(`api/reports/${id}/generatemeta`, requestOBJ);
	};
	/*========= ReportsTreeService End ============*/

}