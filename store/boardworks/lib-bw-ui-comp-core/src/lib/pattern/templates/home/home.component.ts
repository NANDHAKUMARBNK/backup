import { ToastrService } from "./../../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { Component, Input, OnInit } from "@angular/core";
import { HomeService } from "lib-bw-svc-apis/src/lib/home/home.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import {
  createEvent,
  download,
} from "app-bw-meetings/src/app/meeting-details/ics-download-utils";
import { LoginService } from "lib-bw-svc-apis/src/lib/login/login.service";
@Component({
  selector: "bw-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  cardData: any = [
    {
      title: "Upcoming Meetings & Events",
      showTableOrList: true,
    },
  ];
  actions: any = [
    "Add to Calendar",
    "Copy",
    "Create",
    "Delete",
    "Edit",
    "Location Map",
    "Online Meeting URL",
  ];
  columnOptions: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      field: "timestamp",
      title: "Date/Time",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "status",
      title: "Status",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "action",
      title: "Actions",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
    },
  ];
  gridData: any = [];
  cardDataRecentUpdates: any = [
    {
      showText: true,
      showFooter: true,
      title: "Recent Updates",
      body: [],
      footer: "SEE ALL",
    },
  ];
  role: any;
  deleteUpcomingME: boolean = false;
  selectedData: any;
  type: any;
  deleteMsg: any;
  userPermission: any;
  userRole: any;
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  navItems: any;
  constructor(
    private homeService: HomeService,
    private meetingService: MeetingsService,
    private commonService: CommonService,
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private viewFileDocService: ViewFileDocService,
    private route: Router,
    public dialog: DialogRef,
    private loginService: LoginService
  ) {}
  ngOnInit(): void {
    this.getRecentUpdates();
    this.getUpcomingMeetings();
    this.homeService.recentUpdatesLoad.subscribe((res: any) => {
      if (res) {
        this.getRecentUpdates();
      }
    });
    //this.getNavItems();
  }
  // shuffleSideNavs(params: any, type: any) {
  //   let nav_items: any = [];
  //   params.result.leftNavs.map((item: any) => {
  //     let haspermission = true;
  //     if (item.component || item.component == null) {
  //       let navs: any = {
  //         name: item.title,
  //         permission: params.result.permissions,
  //         component: item.component,
  //         userRole: params.result.userRole,
  //         canUseBoard: params.result.canUseBoard,
  //         correlationId: params.correlationId,
  //       };

  //       if (item.title === "Alerts") {
  //         if (params.result.permissions.Alerts == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/alerts.png";
  //         navs.link = "alerts";
  //       } else if (item.title === "Voting") {
  //         if (params.result.permissions.Votings == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/Voting.png";
  //         navs.link = "votings";
  //       } else if (item.title === "Surveys") {
  //         if (params.result.permissions.Surveys == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/surveys.png";
  //         navs.link = "surveys";
  //       } else if (item.title === "Profiles") {
  //         if (params.result.permissions.Profiles == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/profile.png";
  //         navs.link = "profile";
  //       } else if (item.title == "Documents") {
  //         if (params.result.permissions.Collaboration == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/documents.png";
  //         navs.link = "documents";
  //         item.subNavs.map((ele: any) => {
  //           if (ele.title == "Documents") {
  //             ele.link = "documents";
  //           } else if (ele.title == "Collaboration") {
  //             ele.link = "collaborations";

  //             if (params.result.permissions.Collaboration == undefined) {
  //               ele.haspermission = false;
  //             }
  //           }
  //           navs.subNav = item;
  //         });
  //         item.subNavs = item.subNavs.filter(
  //           (subNav: any) => subNav.haspermission != false
  //         );
  //       } else if (item.title === "DirectorsGuide") {
  //         if (params.result.permissions.DirectorsGuide == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/alerts.png";
  //         navs.link = "directorsguide";
  //       } else if (item.title === "General Board Info") {
  //         if (params.result.permissions.GeneralBoardInfo == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/alerts.png";
  //         navs.link = "generalboardinfo";
  //       } else if (item.title === "Meetings & Events") {
  //         if (params.result.permissions.MeetingsEvents == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/meetings.png";
  //         navs.link = "meetings";
  //       } else if (item.title === "Discussions") {
  //         if (params.result.permissions.Discussions == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/evaluations.png";
  //         navs.link = "discussion";
  //       } else if (item.title === "Links") {
  //         if (params.result.permissions.Links == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/links.png";
  //         navs.link = "links";
  //       } else if (item.title === "Collaboration") {
  //         if (params.result.permissions.Collaboration == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/alerts.png";
  //         navs.link = "collaborations";
  //       } else if (item.title === "Evaluations") {
  //         if (params.result.permissions.Evaluations == undefined) {
  //           haspermission = false;
  //         }
  //         navs.icon = "assets/images/eval.png";
  //         navs.link = "evaluations";
  //       } else if (item.title === "Admin") {
  //         if (params.result.permissions.UserAdministration == undefined) {
  //           haspermission = false;
  //         }
  //         navs.link = "user";
  //         navs.icon = "assets/images/admin.png";
  //         if (params.result.permissions.UserAdministration == undefined) {
  //           haspermission = false;
  //         }
  //       } else {
  //         navs.icon = "assets/images/search.png";
  //       }
  //       if (haspermission) {
  //         nav_items.push(navs);
  //         // console.log(nav_items);
  //         this.storage.setData("permisionGurds", JSON.stringify(nav_items));
  //       }
  //     }
  //   });
  //   this.navItems = nav_items;
  //   if (type === "board-selection") {
  //     window.location.reload();
  //   }
  // }
  // getNavItems() {
  //   let leftNavs = this.storage.getData("leftNavs");
  //   let roles_data = this.storage.getData("roles_data");
  //   let pagePermission = this.storage.getData("pagePermission");
  //   if (leftNavs && roles_data && pagePermission) {
  //     const params = {
  //       result: {
  //         leftNavs: JSON.parse(leftNavs),
  //         userRole: JSON.parse(roles_data),
  //         permissions: JSON.parse(pagePermission),
  //       },
  //     };
  //     this.shuffleSideNavs(params, "non-board-selection");
  //   } else {
  //     this.loginService
  //       .selectBoardAndRolesAndPermission({
  //         boardId: this.storage.getData("loggedInBoard"),
  //       })
  //       .subscribe((response: any) => {
  //         const userToken = {
  //           token: response.result.token.accessToken,
  //           expiry: response.result.token.expiry,
  //         };
  //         this.storage.setData("userToken", JSON.stringify(userToken));
  //         if (response) {
  //           this.shuffleSideNavs(response, "non-board-selection");
  //           this.storage.setData("board", JSON.stringify(response));
  //           this.storage.setData(
  //             "roles_data",
  //             JSON.stringify(response.result.userRole)
  //           );
  //           this.storage.setData(
  //             "pagePermission",
  //             JSON.stringify(response.result.permissions)
  //           );
  //         }
  //       });
  //   }
  // }
  onClickAction(e: any) {
    console.log(e);
    this.type = e.data.type;
    this.deleteMsg = `Deleting ${e.data.title} ${this.type} will remove the ${this.type} and any activities that has been associated with it from BoardWorks and any linked devices.`;
    const navigateTo = e.data.type == "Event" ? "newEvent" : "newMetting";
    // alert(e);
    switch (e.action) {
      case "Create":
        this.router.navigate([`meetings/${navigateTo}/information`], {
          relativeTo: this.activatedRoute,
          queryParams: { page: "info", from: "home" },
        });
        break;
      case "Edit":
        this.router.navigate([`./meetings/${navigateTo}/information`], {
          relativeTo: this.activatedRoute,
          queryParams: {
            page: "info",
            type: "edit",
            meetingId: e.data.meetingId,
            commiteeId: e.data.committeeId,
            from: "home",
          },
        });
        break;
      case "Delete":
        this.deleteUpcomingME = true;
        this.selectedData = e.data;
        break;
      case "Add to Calendar":
        const events = [
          {
            start: new Date(e.data.startDateTime),
            end: new Date(e.data.endDateTime),
            summary: e.data.title,
            description: e.data.description,
            location: e.data.location,
            url: e.data.isOnlineMeeting
              ? e.data.onlineMeetingLink
              : "https://meet.google.com/ikn-sfhg-jgs",
          },
        ];
        let content: any = createEvent(events);
        if (content) download(`${e.data.title}.ics`, content);
        break;
      case "Copy":
        const params = {
          page: "info",
          type: "copy",
          meetingId: e.data.meetingId,
          eventId: e.data.meetingId,
          commiteeId: e.data.committeeId,
          status: e.data.status,
        };
        e.data.type == "Event"
          ? delete params.meetingId
          : delete params.eventId;
        this.route.navigate([`./meetings/${navigateTo}/information`], {
          relativeTo: this.activatedRoute,
          queryParams: params,
        });
        break;
      case "Location Map":
        console.log(e.data);
        if (e.data.location && e.data.location !== "") {
          const mapUrl = `http://maps.google.com/maps/place/${e.data.location}`;
          window.open(mapUrl, "_blank");
        }
        break;
      case "Online Meeting URL":
        window.open(e.data.onlineMeetingUrl, "_blank");
        break;
      }
  }
  linksModalAction(e: any) {
    console.log(e);
    if (e.toLowerCase() == "yes") {
      this.deleteUpcomingMEApi(this.selectedData.meetingId);
    } else {
      this.deleteUpcomingME = false;
    }
  }
  deleteUpcomingMEApi(id: any) {
    this.meetingService.deleteMeetingById(id).subscribe((res: any) => {
      if (res) {
        this.toastr.showToastr(
          "success",
          `${this.selectedData.type} Deleted Successfully!`
        );
        this.deleteUpcomingME = false;
        this.getUpcomingMeetings();
      }
    });
  }
  onClickLink(e: any) {
    console.log(e);
    if (e.data && e.data.type && e.data.type == "Meeting") {
      this.router.navigate(
        [
          `meetings/meeting-details`,
          { type: "view", id: e.data.meetingId, from: "home" },
        ],
        { relativeTo: this.activatedRoute }
      );
    } else if (e.data && e.data.type && e.data.type == "Event") {
      this.router.navigate(
        [
          `meetings/event-details`,
          { type: "view", id: e.data.meetingId, from: "home" },
        ],
        { relativeTo: this.activatedRoute }
      );
    }
  }
  async getRecentUpdates() {
    await this.homeService
      .getRecentUpdatesInHome()
      .subscribe((response: any) => {
        if (response.result && response.result.length > 0) {
          this.commonService.setRecentUpdates(response.result);
          let mergeArray: any = this.commonService.getRecentUpdates();
          if (mergeArray.length > 4) {
            for (let i = 0; i < 4; i++) {
              this.cardDataRecentUpdates[0].body.push(mergeArray[i]);
            }
          } else {
            this.cardDataRecentUpdates[0].body = mergeArray;
          }
        } else {
          this.cardDataRecentUpdates[0].body = [];
        }
      });
  }

  getUpcomingMeetings() {
    this.meetingService.getUpcomingMeetings().subscribe((res) => {
      if (res && res.result) {
        let tempArray: any = [];
        res.result.map((data: any) => {
          data.meetingsEvents.map((me: any) => {
            me["linkTextName"] = me.title;
            me["timestamp"] = this.commonService.formatDate(
              me.startDateTime,
              "withTime"
            );
            tempArray.push(me);
          });
        });
        this.userRole = JSON.parse(this.storage.getData("roles_data"));
        if (this.userRole && this.userRole.type.toLowerCase() === "directors") {
          this.gridData = tempArray.filter(
            (item: any) => item.status.toLowerCase() === "published"
          );
          this.actions = [
            "Add to Calendar",
            "Location Map",
            "Online Meeting URL",
            "Download Board Book",
          ];
        } else {
          this.gridData = tempArray;
          this.actions = [
            "Add to Calendar",
            "Copy",
            "Create",
            "Delete",
            "Edit",
            "Location Map",
            "Online Meeting URL",
              ];
        }
      }
    });
  }
  seeAll(e: any) {
    this.router.navigate(["/admin/see-all-recent-updates"]);
  }
  recentupdateClick(params: any) {
    console.log(params, "hello");
    this.commonService.setRecentUpdatePermission(params.entity.toLowerCase());
    if (params.itemType.toLowerCase() === "document") {
      const payload: any = {
        documentId: params.documentId,
        fileName: params.documentFilename
          ? params.documentFilename
          : params.documentTitle,
      };
      let endpoint: any =
        params.entity.toLowerCase() === "references"
          ? `${params.entity}/${
              params.referenceType.toLowerCase() === "directorsguide"
                ? "DirectorsGuide"
                : params.referenceType.toLowerCase() === "corporateinformation"
                ? "CorporateInfo"
                : "GeneralBoardInfo"
            }` + "/Documents"
          : params.entity + "/Documents";
      let url = `${environment.baseUrl}${endpoint}/${params.documentId}`;
      // this.viewFileDocService.viewfile(payload, url);
      this.downloadDocuments(url, [], payload);
    } else {
      if (params.entity.toLowerCase() === "meetingsevents") {
        this.route.navigate(
          [
            `meetings/${params.isEvent ? "event" : "meeting"}-details`,
            {
              type: "view",
              id: params.meetingEventId,
            },
          ],
          {
            relativeTo: this.activatedRoute,
          }
        );
      } else if (params.entity.toLowerCase() === "alerts") {
        this.route.navigate(
          [
            `${params.entity.toLowerCase()}/view-alert`,
            {
              type: "edit",
              id: params.alertId,
            },
          ],
          {
            relativeTo: this.activatedRoute,
          }
        );
      } else if (params.entity.toLowerCase() === "votings") {
        this.route.navigate(
          [
            `${params.entity.toLowerCase()}/view-voting`,
            {
              type: "view",
              id: params.votingId,
              title: params.name,
            },
          ],
          {
            relativeTo: this.activatedRoute,
          }
        );
      } else {
        this.route.navigate(
          [
            `${
              params.entity.toLowerCase() === "references"
                ? "documents"
                : params.entity.toLowerCase() === "discussions"
                ? "evaluations"
                : params.entity.toLowerCase()
            }`,
            {
              id: params.alertId
                ? params.alertId
                : params.collaborationId
                ? params.collaborationId
                : params.discussionId
                ? params.discussionId
                : params.referenceId
                ? params.referenceId
                : params.surveyId
                ? params.surveyId
                : params.votingId
                ? params.votingId
                : params.meetingEventId
                ? params.meetingEventId
                : params.evaluationId
                ? params.evaluationId
                : null,
              module: params.entity,
            },
          ],
          {
            relativeTo: this.activatedRoute,
          }
        );
      }
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  downloadDocuments(url: any, arr?: any, params?: any) {
    this.showLoader = true;
    this.meetingService.getStatusCodeFromUrl(url).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (arr && arr.length) {
          arr.map((int: any) => {
            this.viewFileDocService.viewfile(int, url);
          });
        } else {
          this.viewFileDocService.viewfile(params, url);
        }
      },
      (err: any) => {
        this.showLoader = false;
        if (err.status === 200) {
          this.viewFileDocService.viewfile(params, url);
        } else {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.error}`]);
          }
        }
      }
    );
  }
}
