import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class VotingsServiceService {
  documentData: any;
  votingDocumentsRetain: any;
  constructor(private httpService: HttpService) {}

  getPublishAndUnPublish(type: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${type}`
    );
  }
  getVotingSummaryList(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${id}/${apiConstant.summary}`
    );
  }
  deleteVotingResponse(voteId: any, id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}/Responses/${id}`
    );
  }
  getVotingResponses(voteId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}/Responses`
    );
  }
  getVotingIndividualResponse(voteId: any, id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}/Responses/${id}`
    );
  }
  exportSummary(voteId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}/ExportSummary`
    );
  }
  exportResponses(voteId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}​/ExportResponses`
    );
  }
  getQuestionsBasedOnId(voteId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${voteId}/Questions`
    );
  }
  postResponseById(id: any, req: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Responses`,
      req
    );
  }
  createVotings(body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.votings}`,
      body
    );
  }
  copyVotings(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.votings}/${id}/copy`,
      body
    );
  }
  getVotingsById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${id}`
    );
  }
  updateVotings(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.votings}/${id}`,
      body
    );
  }
  getQuestions(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Questions`
    );
  }
  putPublished(id: any, bool: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.votings}/${id}/${bool}`,
      {}
    );
  }
  putUnPublished(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.votings}/${id}/UnPublish`,
      body
    );
  }

  deleteVoting(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.votings}/${id}`
    );
  }

  deleteResponse(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Responses`
    );
  }
  reorderQuestions(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.votings}/${id}/order`,
      body
    );
  }
  postQuestions(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Question`,
      body
    );
  }
  putQuestions(id: any, body: any, questionId: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Question/${questionId}`,
      body
    );
  }

  getQuestionsById(id: any, questionId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Questions/${questionId}`
    );
  }

  deleteDocumentById(id?: any, document_id?: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.votings}/${id}/${apiConstant.documents}/${document_id}`
    );
  }
  deleteQuestionById(id?: any, question_id?: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.votings}/${id}/Questions/${question_id}`
    );
  }
}
