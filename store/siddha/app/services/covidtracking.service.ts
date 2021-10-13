import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CovidtrackingService {
  constructor(private http: HttpClient) {}
  apiBaseUrlHttps = environment.baseUrlHttps;
  retrieveAnnouncements() {
    return this.http.get(
      `${
        this.apiBaseUrlHttps
      }/announcement?is_active=${true}&is_approved=${true}&serial_number=ASC`
    );
  }
  retrieveStaticContentFlyText() {
    return this.http.get(
      `${this.apiBaseUrlHttps}/staticcontent?sort_order=ASC`
    );
  }
  retrieveStockMedicines() {
    return this.http.get(`${this.apiBaseUrlHttps}/stockreport/district`);
  }
  retrieveEnrollPatientDetails() {
    return this.http.get(`${this.apiBaseUrlHttps}/patient/report`);
  }
  getDistrictWisePopulationDetails() {
    return this.http.get(
      `${
        this.apiBaseUrlHttps
      }/districts/report?registered_doctors=${true}&registered_people=${true}`
    );
  }
  retrieveQualification() {
    return this.http.get(
      `${this.apiBaseUrlHttps}/doctorsqualification?sort_order=ASC`
    );
  }
  retrieveSpecialization() {
    return this.http.get(
      `${this.apiBaseUrlHttps}/doctorsspecialization?sort_order=ASC`
    );
  }
  retrieveDistricts() {
    return this.http.get(`${this.apiBaseUrlHttps}/districts?sort_order=ASC`);
  }
  retrieveDistrictsBasedOnNameAscSort() {
    return this.http.get(
      `${this.apiBaseUrlHttps}/districts?sort_by=name&sort_order=ASC`
    );
  }
  retrieveDistrictsBasedOnPopulationDescSort() {
    return this.http.get(
      `${this.apiBaseUrlHttps}/districts?sort_by=population&sort_order=DESC`
    );
  }
  retrieveDoctorFilterByLocation() {
    return this.http.get(
      `${
        this.apiBaseUrlHttps
      }/doctors?is_active=${true}&is_approved=${true}&filter_by_location=${true}&sort_order=ASC`
    );
  }
  retrieveHospitals() {
    return this.http.get(`${this.apiBaseUrlHttps}/hospitals`);
  }
  retrieveCountries() {
    return this.http.get(`${this.apiBaseUrlHttps}/country?sort_order=ASC`);
  }
  saveDoctorsForm(req) {
    return this.http.post(`${this.apiBaseUrlHttps}/doctorregistration`, req);
  }
  saveHospitalForm(req) {
    return this.http.post(`${this.apiBaseUrlHttps}/hospitals`, req);
  }
  retrieveHospitalBasedOnId(id) {
    return this.http.get(`${this.apiBaseUrlHttps}/hospitals/${id}`);
  }
  uploadFile(req) {
    return this.http.post(`${this.apiBaseUrlHttps}/getsignedURL`, req);
  }
  toS3Api(url, reqFileFormData) {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.put(`${url}`, reqFileFormData, { headers });
  }
  saveVideoManagement(req) {
    return this.http.post(`${this.apiBaseUrlHttps}/videomanagement`, req);
  }
  getVideos() {
    return this.http.get(
      `${
        this.apiBaseUrlHttps
      }/videomanagement?is_active=${true}&is_approved=${true}&sort_order=ASC`
    );
  }
  getColorCodedBars() {
    return this.http.get(`${this.apiBaseUrlHttps}/programs/effectiveness`);
  }
  saveFeedback(request: any) {
    return this.http.post(`${this.apiBaseUrlHttps}/feedback`, request);
  }
}
