import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  cookie: any;
  constructor(
    // readonly cookie: CookieService
  ) { }

  // storage service is used to set and remove data in localStoarge,
  // if in any case browser dosnt support local stoarge application will use cookies
  // automatically based on this service usage

  sessionStorage() {
    try {
      sessionStorage.setItem('key', 'value');
    } catch (e) {
      return false;
    }
    // tslint:disable-next-line:no-string-literal
    sessionStorage.removeItem('key')
    return true;
  }
  setData(key: string, value: any) {
    window.sessionStorage.setItem(key, value);
  }

  getData(key: string) {
    // if (this.sessionStorage()) {
    // } else {
    //   return this.cookie.get(key) || null;
    // }
    return window.sessionStorage[key];
  }

  removeData(key: string) {
    delete window.sessionStorage[key];
  }

  removeAllData() {
    window.sessionStorage.clear();
  }
}
