import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';
import { ExportService } from 'app-bw-meetings/src/app/meetings-events-list/Export.service';
import { environment } from 'environments/environment';
import { apiConstant } from 'lib-bw-svc-apis/src/lib/constant/apiConstant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';

@Component({
  selector: 'app-responses-home',
  templateUrl: './responses-home.component.html',
  styleUrls: ['./responses-home.component.scss'],
  providers: [ExportService],

})
export class ResponsesHomeComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Evaluations",
      title: "Evaluations",
    },
    {
      text: "Results",
      title: "Results",
    },
  ];
  tabsData: any = [
    {
      title: "SUMMARY",
      content: "",
      isSelected: true,
      isDisabled: true,
    },
    {
      title: "RESPONSES",
      content: "This is RESPONSES Tab",
      isSelected: false,
      isDisabled: false,
    }
  ];
  tab: any = "SUMMARY";
  title: any;
  summaryTab: any;
  responsesTab: any;
  activeClass: any =
    "btn-base btn-containe bw-font-prm-medium secondary-btn-contained btn-sm px-4 btn-tab";
  inActiveClass: any =
    "btn-base secondary-btn-text border-secondary bw-font-prm-medium btn-sm px-4 btn-tab";
  evalId: any;
  evaluationData: any;
  hideResponsesBtns: boolean=true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private storageService: StorageService,
    private evaluationsService: EvaluationsService



  ) {
    this.title = this.activatedRoute.snapshot.params.title
    this.summaryTab = this.activeClass;
    this.responsesTab = this.inActiveClass
  }

  ngOnInit(): void {
    this.evalId = this.activatedRoute.snapshot.params.id;
    this.getEvalutionById()
  }


  getEvalutionById() {
    this.evaluationsService.getEvalutionsById(this.evalId).subscribe((data: any) => {
      //let resultdata=data;
      this.evaluationData = data;


      if (data.isAnonymous) {
        this.hideResponsesBtns = false;
      } else {
        this.hideResponsesBtns = true;

      }

    })
  }


  tabChange(event: any) {
    this.tab = event.title;
  }

  clickButton(e: any) {
    switch (e) {
      case 'summary':
        this.summaryTab = this.activeClass;
        this.responsesTab = this.inActiveClass;
        this.tab = 'SUMMARY';
        break;
      case 'responses':
        this.summaryTab = this.inActiveClass;
        this.responsesTab = this.activeClass;
        this.tab = 'RESPONSES'
        break;
    }
  }

  export(e: any, type: any) {
    if (type == 'summary') {
      let token = this.storageService.getData("userToken");
      const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
      let url;

      url = ` ${environment.baseUrl}${apiConstant.evaluations}/${this.evalId}/ExportSummary`

      this.http
        .get(
          `${url}`,
          { headers, responseType: "arraybuffer" }
        )
        .subscribe(
          (data: ArrayBuffer) => {
            try {
              const binArray = new Uint8Array(data);
              const fileBlob = new Blob([binArray], { type: "text/csv" });
              // this.image = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              const url = window.URL.createObjectURL(fileBlob);

              a.href = url;
              a.download = 'ExportSummary.csv';
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
            } catch (error) { }
          },
          (error) => {
            if (error.status == 404) {
            }
          }
        );

    } else {

      let token = this.storageService.getData("userToken");
      const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
      let url;

      url = ` ${environment.baseUrl}${apiConstant.evaluations}/${this.evalId}/ExportResponses`

      this.http
        .get(
          `${url}`,
          { headers, responseType: "arraybuffer" }
        )
        .subscribe(
          (data: ArrayBuffer) => {
            try {
              const binArray = new Uint8Array(data);
              const fileBlob = new Blob([binArray], { type: "text/csv" });
              // this.image = window.URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              const url = window.URL.createObjectURL(fileBlob);

              a.href = url;
              a.download = 'ExportResponses.csv';
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
            } catch (error) { }
          },
          (error) => {
            if (error.status == 404) {
            }
          }
        );

    }
  }


  navigateInto(params: any) {
    if (params.text === "Evaluations" || params.title === "Evaluations") {
      this.location.back();
    }
  }

}
