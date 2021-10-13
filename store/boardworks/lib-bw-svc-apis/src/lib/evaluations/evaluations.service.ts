import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class EvaluationsService {
  documentData: any;
  documentsRetain: any;
  constructor(private httpService: HttpService) { }

  getPublished() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/Published`
    );
  }
  getUPublished() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/Unpublished`
    );
  }
  getTemplates() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/Templates`
    );
  }
  createEvalutions(body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}`,
      body
    );
  }
  createEvalutionsTemplate(body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}/Template`,
      body
    );
  }
  copyEvalutions(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/copy`,
      body
    );
  }
  getEvalutionsById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}`
    );
  }
  updateEvalutions(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}`,
      body
    );
  }

  adminUsers() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/Administrators`
    );
  }

  getQuestions(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Questions`
    );
  }
  putPublished(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Publish`,
      body
    );
  }
  putUnPublished(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/UnPublish`,
      body
    );
  }

  deleteEvalution(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}`
    );
  }

  deleteEvaluationQuestion(evaluationId: any, questionId: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.evaluations}/${evaluationId}/Questions/${questionId}`);
  }
  
  deleteResponse(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Responses`
    );
  }

  parentQuestions(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/ParentQuestions`
    );
  }
  getQuestionsBasedOnId(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Questions`
    );
  }
  postResponseById(id: any, req: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Responses`,
      req
    );
  }

  createNewQuestion(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Questions`,
      body
    );
  }

  getEvaluationSummaryList(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.evaluations}/${id}/${apiConstant.summary}`)
  }

  deleteEvaluationResponse(evalId: any, id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.evaluations}/${evalId}/Responses/${id}`);
  }

  getEvaluationResponses(evalId: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.evaluations}/${evalId}/Responses`)
  }
  getEvaluationIndividualResponse(evalId: any, id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.evaluations}/${evalId}/Responses/${id}`)
  }
  getQuestionsById(evaluationsId: any, questionId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${evaluationsId}/Questions/${questionId}`
    );
  }

  updateQuestion(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/Questions`,
      body
    );
  }
  reorderQuestions(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/order`,
      body
    );
  }

  exportSummary(evaluationsId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${evaluationsId}/ExportSummary`
    );
  }
  exportResponses(evaluationsId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${evaluationsId}​/ExportResponses`
    );
  }
  deleteDocumentById(id?: any, document_id?: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/${apiConstant.documents}/${document_id}`
    );
  }

  getEvalDocuments(id?: any, document_id?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.evaluations}/${id}/${apiConstant.documents}`
    );
  }
}
