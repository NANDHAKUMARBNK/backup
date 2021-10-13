import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { process } from "@progress/kendo-data-query";
import { AdminUsersService } from "lib-bw-svc-apis/src/lib/admin-users/admin-users.service";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  counter: number = 0;
  savePdfFlag: boolean = false;
  isExportPdf: boolean = true;
  onCellClickedActiveGrid: any = [];
  onCellClickedNonActiveGrid: any = [];
  selectField = new FormControl();
  isActiveGrid: boolean = true;
  report: any;
  reports: any = [
    {
      reportId: 1,
      reportName: "Active User Report",
    },
    {
      reportId: 2,
      reportName: "User Roles & Committee",
    },
  ];
  defaultItem = { reportId: "", reportName: "Select Report" };
  defaultItems: any = [
    {
      text: "Administration Reports",
      title: "Administration Reports",
    },
    {
      text: "Reports",
      title: "Reports",
    },
  ];
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "username",
      title: "USER NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "displayName",
      title: "DISPLAY NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "email",
      title: "EMAIL ADDRESS",
      filterType: "text",
      isEnableColumnOptions: false,
    },

    {
      field: "isMFAEnabled",
      title: "REQUIRE MFA",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "isPasswordNeverExpires",
      title: "PASSWORD NEVER EXPIRES",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "lastLogin",
      title: "LAST LOGIN",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "passwordExpiry",
      title: "PASSWORD EXPIRATION DATE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  columnsDataRolesAndCommittees: any = [
    {
      field: "username",
      title: "USER NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "displayName",
      title: "DISPLAY NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "role",
      title: "ROLES",
      filterType: "text",
      isEnableColumnOptions: false,
    },

    {
      field: "committeeNames",
      title: "COMMITTEE(S)",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "committee_names",
    },
  ];
  data: any;
  gridData: any;
  gridDataRolesAndCommittees: any;
  excelexport: any;
  @ViewChild("excelexport") element!: any;
  excelColumnData: any = [
    {
      field: "username",
      title: "USER NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "displayName",
      title: "DISPLAY NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "email",
      title: "EMAIL ADDRESS",
      filterType: "text",
      isEnableColumnOptions: false,
    },

    {
      field: "isMFAEnabled",
      title: "REQUIRE MFA",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "isPasswordNeverExpires",
      title: "PASSWORD NEVER EXPIRES",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "lastLogin",
      title: "LAST LOGIN",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "passwordExpiry",
      title: "PASSWORD EXPIRATION DATE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "committeeNames",
      title: "COMMITTEE(S)",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  isEnablePagination: boolean = true;
  errMessage: any;
  isError: boolean = false;
  isEnableExpand: boolean = false;
  constructor(
    private adminUserService: AdminUsersService,
    private route: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.activeUserReports();
    this.userRolesAndCommitteesReports();
  }

  navigateInto(params: any) {
    if (
      params.text === "Administration Reports" ||
      params.title === "Administration Reports"
    ) {
      this.route.navigate(["admin/user"]);
    }
  }
  exportExcel(params: any) {
    this.data = process(params, {}).data;
  }
  activeUserReports() {
    this.adminUserService.getAdminActiveUserReport().subscribe(
      (response: any) => {
        if (response.result) {
          let tempArr: any = [];
          response.result.map((item: any) => {
            tempArr.push({
              userId: item.userId ? item.userId : "NA",
              displayName: item.displayName ? item.displayName : "NA",
              username: item.username ? item.username : "NA",
              email: item.email ? item.email : "NA",
              isPasswordNeverExpires: item.isPasswordNeverExpires
                ? item.isPasswordNeverExpires
                : "NA",
              isMFAEnabled: item.isMFAEnabled ? item.isMFAEnabled : "NA",
              lastLogin: item.lastLogin
                ? item.lastLogin.replace("T", " | ")
                : "NA",
              passwordExpiry: item.passwordExpiry
                ? item.passwordExpiry.replace("T", " | ")
                : "NA",
            });
          });
          this.gridData = tempArr;
          this.exportExcel(this.gridData);
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  userRolesAndCommitteesReports() {
    this.adminUserService.getAdminUserRolesAndCommitteesReport().subscribe(
      (response: any) => {
        if (response.result) {
          let tempArr: any = [];
          response.result.map((item: any) => {
            tempArr.push({
              userId: item.userId ? item.userId : "NA",
              username: item.username ? item.username : "NA",
              displayName: item.displayName ? item.displayName : "NA",
              role: item.role ? item.role : "NA",
              committeeNames: item.committeeNames ? item.committeeNames : "NA",
            });
          });
          this.gridDataRolesAndCommittees = tempArr;
          let excelData: any = [];
          let committees = "";
          response.result.map((item: any) => {
            committees = "";
            item.committeeNames.map((com: any) => {
              committees = committees !== "" ? committees + ", " + com : com;
            });
            excelData.push({
              userId: item.userId ? item.userId : "NA",
              username: item.username ? item.username : "NA",
              displayName: item.displayName ? item.displayName : "NA",
              role: item.role ? item.role : "NA",
              committeeNames: committees ? committees : "NA",
            });
          });
          this.exportExcel(excelData);
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  clickButton(e: any) {
    if (!this.report) {
      // this.toastr.showToastr("info", "Please select a report");
      alert("Please select a report");
    }
    if (this.report === "User Roles & Committee") {
      this.savePdfFlag = false;
      this.isActiveGrid = false;
      this.isExportPdf = false;
      this.excelColumnData = this.columnsDataRolesAndCommittees;
      this.userRolesAndCommitteesReports();
    } else {
      this.savePdfFlag = false;
      this.isActiveGrid = true;
      this.isExportPdf = false;
      this.excelColumnData = this.columnsData;
      this.activeUserReports();
    }
  }
  changeReport(e: any) {
    this.report = e;
  }
  public exportToPDF(): any {
    this.isEnableExpand = true;
    this.savePdfFlag = true;
    this.counter = this.counter + 1;
    // if (this.savePdfFlag) {
    //   this.counter = this.counter + 1;
    // }
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
