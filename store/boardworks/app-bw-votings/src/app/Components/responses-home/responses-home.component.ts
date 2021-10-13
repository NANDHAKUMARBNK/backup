import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";
import { EvaluationExportData } from "./mapExportData";
import { IExport } from "./IExportadata";
import { ExportColumnHeaders } from "./exportHeader";
import { ExportService } from "app-bw-meetings/src/app/meetings-events-list/Export.service";
import { environment } from "environments/environment";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
@Component({
  selector: "app-responses-home",
  templateUrl: "./responses-home.component.html",
  styleUrls: ["./responses-home.component.scss"],
  providers: [ExportService],
})
export class ResponsesHomeComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Votings",
      title: "Votings",
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
    },
  ];
  tab: any = "SUMMARY";
  title: any;
  summaryTab: any;
  responsesTab: any;
  activeClass: any =
    "btn-base btn-containe bw-font-prm-medium secondary-btn-contained btn-sm px-4 btn-tab";
  inActiveClass: any =
    "btn-base secondary-btn-text border-secondary bw-font-prm-medium btn-sm px-4 btn-tab";
  voteId: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private voteService: VotingsServiceService,
    private exportService: ExportService,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.voteId = this.activatedRoute.snapshot.params.id;
    this.title = this.activatedRoute.snapshot.params.title;
    this.summaryTab = this.activeClass;
    this.responsesTab = this.inActiveClass;
  }

  ngOnInit(): void {}

  tabChange(event: any) {
    this.tab = event.title;
  }

  clickButton(e: any) {
    switch (e) {
      case "summary":
        this.summaryTab = this.activeClass;
        this.responsesTab = this.inActiveClass;
        this.tab = "SUMMARY";
        break;
      case "responses":
        this.summaryTab = this.inActiveClass;
        this.responsesTab = this.activeClass;
        this.tab = "RESPONSES";
        break;
    }
  }
  export(e: any, type: any) {
    if (type == "summary") {
      let token = this.storageService.getData("userToken");
      const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
      let url;
      url = ` ${environment.baseUrl}${apiConstant.votings}/${this.voteId}/ExportSummary`;
      this.http
        .get(`${url}`, { headers, responseType: "arraybuffer" })
        .subscribe(
          (data: ArrayBuffer) => {
            try {
              const binArray = new Uint8Array(data);
              const fileBlob = new Blob([binArray], { type: "text/csv" });
              // this.image = window.URL.createObjectURL(fileBlob);
              const a = document.createElement("a");
              const url = window.URL.createObjectURL(fileBlob);
              a.href = url;
              a.download = "ExportSummary.csv";
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
            } catch (error) {}
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
      url = ` ${environment.baseUrl}${apiConstant.votings}/${this.voteId}/ExportResponses`;
      this.http
        .get(`${url}`, { headers, responseType: "arraybuffer" })
        .subscribe(
          (data: ArrayBuffer) => {
            try {
              const binArray = new Uint8Array(data);
              const fileBlob = new Blob([binArray], { type: "text/csv" });
              // this.image = window.URL.createObjectURL(fileBlob);
              const a = document.createElement("a");
              const url = window.URL.createObjectURL(fileBlob);
              a.href = url;
              a.download = "ExportResponses.csv";
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
            } catch (error) {}
          },
          (error) => {
            if (error.status == 404) {
            }
          }
        );
    }
  }
  // export(e: any, type: any) {
  //   if (type == "summary") {
  //     this.voteService.exportSummary(this.voteId).subscribe((data: any) => {
  //       // this.exportSummayCsv(data.result)
  //     });
  //   } else {
  //     this.voteService.exportResponses(this.voteId).subscribe((data: any) => {
  //       // this.exportResponsesCsv(data.result)
  //     });
  //   }
  // }

  // exportSummayCsv(gridData: any) {
  //   if (gridData && gridData.length) {
  //     var exportData: IExport = {
  //       data: gridData.map((x: any) => EvaluationExportData.mapsummaryItems(x)),
  //       columnHeaders: ExportColumnHeaders.GridColumns,
  //       columnHeaderNotToBeIncluded: [],
  //     };
  //     this.exportService.ExportToCSV(exportData);
  //   } else {
  //     alert("Grid has no data");
  //   }
  // }

  // exportResponsesCsv(gridData: any) {
  //   if (gridData && gridData.length) {
  //     var exportData: IExport = {
  //       data: gridData.map((x: any) =>
  //         EvaluationExportData.mapItemsResponsesReport(x)
  //       ),
  //       columnHeaders: ExportColumnHeaders.GridColumns,
  //       columnHeaderNotToBeIncluded: [],
  //     };
  //     this.exportService.ExportToCSV(exportData);
  //   } else {
  //     alert("Grid has no data");
  //   }
  // }

  navigateInto(params: any) {
    if (params.text === "Votings" || params.title === "Votings") {
      this.location.back();
    }
  }
}
