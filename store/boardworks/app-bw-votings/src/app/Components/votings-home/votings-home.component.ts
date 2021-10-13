import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { ROLES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";
import { EvaluationsService } from "lib-bw-svc-apis/src/lib/evaluations/evaluations.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";

@Component({
  selector: "app-votings-home",
  templateUrl: "./votings-home.component.html",
  styleUrls: ["./votings-home.component.scss"],
})
export class VotingsHomeComponent implements OnInit {
  // tabsData: any = [
  //   {
  //     title: "PUBLISHED",
  //     content: "",
  //     isSelected: true,
  //     isDisabled: true,
  //   },
  //   {
  //     title: "UNPUBLISHED",
  //     content: "This is unpublished Tab",
  //     isSelected: false,
  //     isDisabled: false,
  //   },
  // ];
  tabsData: any = [];
  publishedTabData = {
    title: "PUBLISHED",
    content: "",
    isSelected: true,
    isDisabled: true,
  };
  unPublishedTabData = {
    title: "UNPUBLISHED",
    content: "This is unpublished Tab",
    isSelected: false,
    isDisabled: false,
  };
  tab: any = "PUBLISHED";
  userPermission: any;
  createVotings: boolean = true;
  deleteVotings: boolean = false;
  actions: any = ["Edit", "Delete"];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };

  columnsData: any = [];
  gridData: any;
  errMessage: any;
  isError: boolean = false;
  selectedData: any;
  userRole: any;
  isDirector: boolean = true;
  constructor(
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private votingService: VotingsServiceService,
    private commonService: CommonService
  ) {
    this.tabsData.push(this.publishedTabData);
  }

  ngOnInit(): void {
    // this.userPermission =
    //   this.storage.getData("rolePermission") &&
    //   JSON.parse(this.storage.getData("rolePermission"));
    // this.userPermission &&
    //   this.userPermission.permission &&
    //   this.userPermission.permission.Evaluations &&
    //   this.userPermission.permission.Evaluations.forEach((element: any) => {
    //     if (
    //       element.action == "CreateVotings" &&
    //       element.permission == "Allow"
    //     ) {
    //       this.createVotings = true;
    //     }
    //   });
    this.userPermission = JSON.parse(this.storage.getData("userPermission"));
    this.userRole = JSON.parse(this.storage.getData("roles_data"));
    if (
      this.userRole.type == ROLES.administrators ||
      this.userRole.type == ROLES.documentAdmins ||
      this.userRole.type == ROLES.userAdmins
    ) {
      this.isDirector = false;
      this.tabsData.push(this.unPublishedTabData);
      this.columnsData = [
        {
          field: "TwolinkTextName",
          title: "Voting Name",
          filterType: "text",
          component: "TwolinkTextName",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "createdDate",
          title: "DATE CREATED",
          filterType: "text",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "count",
          title: "# of Responses",
          filterType: "text",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "closingDate",
          title: "Closing Date",
          isEnableColumnOptions: false,
          width: "250px",
        },

        {
          field: "linkPopup",
          title: " ",
          component: "linkPopup",
          isEnableColumnOptions: false,
          linkClassName: "bw-font-sec-bold",
          width: "250px",
        },
        {
          field: "linkTextName",
          title: "ACTIONS",
          component: "action",
          isEnableColumnOptions: false,
          width: "250px",
        },
      ];
    } else {
      this.columnsData = [
        {
          field: "TwolinkTextName",
          title: "Voting Name",
          filterType: "text",
          component: "TwolinkTextName",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "createdDate",
          title: "DATE CREATED",
          filterType: "text",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "count",
          title: "# of Responses",
          filterType: "text",
          isEnableColumnOptions: false,
          width: "250px",
        },
        {
          field: "closingDate",
          title: "Closing Date",
          isEnableColumnOptions: false,
          width: "250px",
        },
      ];
    }
    this.getGridData("Published");
  }
  getGridData(type?: any) {
    this.votingService.getPublishAndUnPublish(type).subscribe(
      (res: any) => {
        if (res) {
          // let result: any = res.result.sort(function (a: any, b: any) {
          //   let B: any = new Date(b.createdDate);
          //   let A: any = new Date(a.createdDate);
          //   return B - A;
          // });
          res.result.filter((data: any) => {
            data["TwolinkTextName"] = data.votingName;
            data["linkTextName"] = "Edit";
            // data["linkPopup"] = "VIEW RESPONSES";
            data["createdDate"] = this.commonService.formatDate(
              data.createdDate
            );
            data["count"] =
              data.totalRespondedRecipients + "/" + data.totalRecipients;
            data.closingDate = this.commonService.formatDate(data.closingDate);
            data["linkText"] = data["votingName"] && true;
            data["linkPopup"] =
              data["totalRespondedRecipients"] > 0 ? "VIEW RESPONSES" : null;
          });
          if (this.isDirector) {
            const tdy: any = new Date();
            this.gridData = res.result.filter(
              (it: any) => new Date(it.closingDate) >= tdy
            );
          } else {
            this.gridData = res.result;
          }
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  tabChange(event: any) {
    this.tab = event.title;
    this.getGridData(this.tab === "PUBLISHED" ? "Published" : "Unpublished");
  }
  newVoting(e: any) {
    this.router.navigate(["create-vote"], { relativeTo: this.activatedRoute });
  }
  linksModalAction(e: any, type: any) {
    console.log(e, "");

    if (type == "save") {
      this.votingService
        .deleteVoting(this.selectedData.votingId)
        .subscribe((data: any) => {
          this.deleteVotings = false;
          this.getGridData(
            this.tab === "PUBLISHED" ? "Published" : "Unpublished"
          );
        });
    } else {
      this.deleteVotings = false;
    }
  }
  onClickLink(e: any) {
    console.log(e, "eeee");
    const { type, data }: any = e;
    switch (type) {
      case "linkPopupContent":
        break;
      case "VIEW RESPONSES":
        this.redirectToView(data);
        break;
      case "TwolinkTextName":
        this.redirectToEdit(data);
        break;
    }
  }
  redirectToView(data: any) {
    const { votingId, votingName }: any = data;
    this.router.navigate(
      [`view-results`, { type: "view", id: votingId, title: votingName }],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
  redirectToEdit(res: any) {
    const { votingId, votingName }: any = res;
    this.router.navigate(
      [`view-voting`, { type: "view", id: votingId, title: votingName }],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
  onClickAction(event: any) {
    if (event.action == "Copy") {
      this.router.navigate(["create-vote"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.votingId, type: "copy" },
      });
    } else if (event.action === "Edit") {
      this.router.navigate(["edit-voting"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.votingId, type: "edit" },
      });
    } else if (event.action === "Delete") {
      this.deleteVotings = true;
      this.selectedData = event.data;
    } else {
    }
  }
}
