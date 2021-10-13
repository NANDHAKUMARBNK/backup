import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'
import { HttpService } from '../http/http.service';
import { apiConstant } from '../constant/apiConstant'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  constructor(private httpService: HttpService, private storageService: StorageService , private http:HttpClient) { }

  createSurvey(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}`, body);
  };

  getPublishedSurveyList() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/Published`)
  }

  getUnPublishedSurveyList() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/UnPublished`)
  }

  getTemplateSurveyList() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/Templates`)
  }

  getSurveySummaryList(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/${id}/${apiConstant.summary}`)
  }

  deleteSurveyResponse(surveyId: any, id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.surveys}/${surveyId}/Responses/${id}`);
  }

  deleteSurveyQuestion(surveyId: any, id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.surveys}/${surveyId}/Questions/${id}`);
  }

  getSurveyResponses(surveyId: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/${surveyId}/Responses`)
  }

  getsurveyIndividualResponse(evalId:any, id:any){
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/${evalId}/Responses/${id}`)
  }

  createSurveyTemplate(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}/Template`, body);
  }

  copySurvey(id: any, body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}/Copy`, body);
  }

  getSurveyById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/${id}`);
  }

  updateSurvey(id: any, body: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.surveys}/${id}`, body);
  }

  createResponseById(id: any, req: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}/${id}/Response`, req);
  }

  getSurveyQuestionsBasedOnId(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.surveys}/${id}/Questions`);
  }

  putPublished(id: any, body: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.surveys}/${id}/Publish`, body);
  }

  putUnPublished(id: any, body: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.surveys}/${id}/UnPublish`, body);
  }
  
  deleteSurvey(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.surveys}/${id}`);
  }

  deleteResponse(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.surveys}/${id}/Responses`);
  }
  /// 
  reorderQuestions(id: any, body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}/${id}/order`, body);
  }

  getQuestionsById(id: any, questionId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.surveys}/${id}/Questions/${questionId}`
    );
  }

  createNewQuestion(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.surveys}/${id}/Questions`,
      body
    );
  }

  updateQuestion(id: any, body: any, questionId?: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.surveys}/${id}/Questions/${questionId}`,
      body
    );
  }

  useSurveyTemplate(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.surveys}/UseTemplate`, body);
  }

  exportSummary(surveyId: any) {
    let token = this.storageService.getData("userToken");
    const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
    let url;
    url = ` ${environment.baseUrl}${apiConstant.surveys}/${surveyId}/ExportSummary`;
    return this.http
      .get(`${url}`,  { headers , responseType: "arraybuffer" })
      }
      
  exportResponses(surveyId: any) {
    let token = this.storageService.getData("userToken");
    const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
    let url;
    url = ` ${environment.baseUrl}${apiConstant.surveys}/${surveyId}/ExportResponses`;
    return this.http
      .get(`${url}`,  { headers , responseType: "arraybuffer" })

  }

}
