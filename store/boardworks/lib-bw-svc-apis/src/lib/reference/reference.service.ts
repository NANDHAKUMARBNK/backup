import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class ReferenceService {
  constructor(private httpService: HttpService) {}
  getReferenceTest(type?: any, archived?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.references}/${type}?isArchived=${archived}`
    );
  }
  getReferenceDetails(type?: any, id?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.references}/${type}/${id}`
    );
  }
  deleteReference(type?: any, id?: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.references}/${type}/${id}`
    );
  }
  deleteReferenceDocuments(type?: any, req?: any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: req,
    };
    return this.httpService.deleteWithBody(
      `${environment.baseUrl}${apiConstant.references}/${type}/${apiConstant.documents}`,
      options
    );
  }
  manipulateReferenceFolder(type?: any, id?: any, req?: any, mode?: any) {
    if (mode === "edit") {
      return this.httpService.put(
        `${environment.baseUrl}${apiConstant.references}/${type}/${id}`,
        req
      );
    } else {
      return this.httpService.post(
        `${environment.baseUrl}${apiConstant.references}/${type}`,
        req
      );
    }
  }
  uploadReferenceDocument(type?: any, id?: any, data?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.references}/${type}/${id}/${apiConstant.documents}`,
      data
    );
  }

  getSignatureRequests(type: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.references}/${type}/${apiConstant.signatureRequests}`
    );
  }

  getReferenceDocument(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.documentsCache}/${id}`
    );
  }

  addNewFolder(type: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.references}/${type}`,
      body
    );
  }
  getSignatureWorkflow(infoId: any, workflowId: any, type: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.references}/${type}/${infoId}/${apiConstant.workflow}/${workflowId}`
    );
  }
  sendRemainderWorkflow(infoId: any, workflowId: any, type: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.references}/${type}/${infoId}/${workflowId}/${apiConstant.sendRemainder}`,
      {}
    );
  }
  deleteSignatureWorkflow(infoId: any, workflowId: any, type: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.references}/${type}/${infoId}/${apiConstant.workflow}/${workflowId}`
    );
  }
  putSignatureWorkflow(infoId: any, workflowId: any, type: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.references}/${type}/${infoId}/${apiConstant.workflow}/${workflowId}`
    );
  }
  getDocuments(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alertsDocument}/${id}`
    );
  }

  createSignatureRequest(type: any, data: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.references}/${type}/${apiConstant.signatureRequest}`,
      data
    );
  }
  terminateSignatureWorkflow(infoId: any, workflowId: any, type: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.references}/${type}/${infoId}/${apiConstant.workflow}/${workflowId}/Terminate`
    );
  }
  archiveAndUnarchiveReference(type?: any, id?: any, mode?: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.references}/${type}/${id}/${mode}`
    );
  }
}
