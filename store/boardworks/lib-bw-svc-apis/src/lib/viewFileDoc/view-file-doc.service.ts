import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from "../storage/storage.service";

@Injectable({
  providedIn: "root",
})
export class ViewFileDocService {
  imageView: boolean = false;
  pdfView: boolean = false;
  textView: boolean = false;
  exacelView: boolean = false;
  @Output() errorHandle: any = new EventEmitter<any>();
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  viewfile(docData: any, url: any) {
    let token = this.storageService.getData("userToken");
    const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
    this.http.get(`${url}`, { headers, responseType: "arraybuffer" }).subscribe(
      (data: ArrayBuffer) => {
        try {          
          let fileName = docData.fileName;
          
          let fileFormat = fileName.split(".").pop();
          const binArray = new Uint8Array(data);
          let fileBlob;
          if (fileFormat == "pdf") {
            this.pdfView = true;
            fileBlob = new Blob([binArray], { type: "application/pdf" });
          } else if (
            fileFormat == "jpg" ||
            fileFormat == "png" ||
            fileFormat == "jpeg"
          ) {
            this.imageView = true;
            fileBlob = new Blob([binArray], { type: "image" });
          } else if (fileFormat == "txt") {
            this.textView = true;
            fileBlob = new Blob([binArray], { type: "text/plan" });
          } else {
            fileBlob = new Blob([binArray], { type: "octet/stream" });
          }
          let viewFile = window.URL.createObjectURL(fileBlob);
          let url = window.URL.createObjectURL(fileBlob);
          let newWin: any = window.open(
            "about:blank",
            "hello",
            "width=1000,height=1000"
          );
          if (fileFormat == "pdf") {
            newWin.document.body.innerHTML = `<embed src='${viewFile}' style="width:1000px;height:1000px;"></embed>`;
          } else if (
            fileFormat == "jpg" ||
            fileFormat == "png" ||
            fileFormat == "jpeg"
          ) {
            newWin.document.body.innerHTML = `<img src='${viewFile}' width="100%" />`;
          } else if (fileFormat == "txt") {
            newWin.document.body.innerHTML = `<embed src='${viewFile}' style="width:1000px;height:1000px;"></embed>`;
          } else {
            const a = newWin.document.createElement("a");
            newWin.document.body.appendChild(a);
            a.href = viewFile;
            a.download = docData.fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            // newWin.document.body.innerHTML = `<embed src='${viewFile}' style="width:1000px;height:1000px;"></embed>`;
          }
          //
        } catch (error) {
          this.errorHandle.emit(error);
        }
      },
      (error) => {
        this.errorHandle.emit(error);
      }
    );
  }
}
