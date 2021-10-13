import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { LoginService } from "lib-bw-svc-apis/src/lib/login/login.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { IntercomService } from "lib-bw-svc-apis/src/lib/intercom/intercom.service";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
  // host: {
  //   '(document:click)': 'onClick($event)',
  // },
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  navItems: any;
  activeClass: any;
  boards: any;
  isShowBoardsModal: boolean = false;
  boardDetails: any;
  subNavItems: any = [];
  sideMenuFlag = false;
  topMenuFlag = false;
  constructor(
    private commonService: CommonService,
    private router: Router,
    public dialog: DialogRef,
    private loginService: LoginService,
    private storage: StorageService,
    private activateRoute: ActivatedRoute,
    private dialogService: DialogService,
    private _eref: ElementRef,
    private intercomService: IntercomService
  ) {}

  ngOnInit(): void {
    this.getNavItems();
    this.getBoards();
    this.InitIntercom();
  }

  ngOnDestroy() {
    this.DestroyIntercom();
  }

  getBoards() {
    let boards = this.storage.getData("boards");
    this.boards = (boards && JSON.parse(boards)) || [];
  }
  shuffleSideNavs(params: any, type: any) {
    let nav_items: any = [];
    params.result.leftNavs.map((item: any) => {
      let haspermission = true;
      if (item.component || item.component == null) {
        let navs: any = {
          name: item.title,
          permission: params.result.permissions,
          component: item.component,
          userRole: params.result.userRole,
          canUseBoard: params.result.canUseBoard,
          correlationId: params.correlationId,
        };

        if (item.title === "Alerts") {
          if (params.result.permissions.Alerts == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/alerts.png";
          navs.link = "alerts";
        } else if (item.title === "Voting") {
          if (params.result.permissions.Votings == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/Voting.png";
          navs.link = "votings";
        } else if (item.title === "Surveys") {
          if (params.result.permissions.Surveys == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/surveys.png";
          navs.link = "surveys";
        } else if (item.title === "Profiles") {
          if (params.result.permissions.Profiles == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/profile.png";
          navs.link = "profile";
        } else if (item.title == "Documents") {
          if (params.result.permissions.Collaboration == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/documents.png";
          navs.link = "documents";
          item.subNavs.map((ele: any) => {
            if (ele.title == "Documents") {
              ele.link = "documents";
            } else if (ele.title == "Collaboration") {
              ele.link = "collaborations";

              if (params.result.permissions.Collaboration == undefined) {
                ele.haspermission = false;
              }
            }
            navs.subNav = item;
          });
          item.subNavs = item.subNavs.filter(
            (subNav: any) => subNav.haspermission != false
          );
        } else if (item.title === "DirectorsGuide") {
          if (params.result.permissions.DirectorsGuide == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/alerts.png";
          navs.link = "directorsguide";
        } else if (item.title === "General Board Info") {
          if (params.result.permissions.GeneralBoardInfo == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/alerts.png";
          navs.link = "generalboardinfo";
        } else if (item.title === "Meetings & Events") {
          if (params.result.permissions.MeetingsEvents == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/meetings.png";
          navs.link = "meetings";
        } else if (item.title === "Discussions") {
          if (params.result.permissions.Discussions == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/evaluations.png";
          navs.link = "discussion";
        } else if (item.title === "Links") {
          if (params.result.permissions.Links == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/links.png";
          navs.link = "links";
        } else if (item.title === "Collaboration") {
          if (params.result.permissions.Collaboration == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/alerts.png";
          navs.link = "collaborations";
        } else if (item.title === "Evaluations") {
          if (params.result.permissions.Evaluations == undefined) {
            haspermission = false;
          }
          navs.icon = "assets/images/eval.png";
          navs.link = "evaluations";
        } else if (item.title === "Admin") {
          if (params.result.permissions.UserAdministration == undefined) {
            haspermission = false;
          }
          navs.link = "user";
          navs.icon = "assets/images/admin.png";
          if (params.result.permissions.UserAdministration == undefined) {
            haspermission = false;
          }
        } else {
          navs.icon = "assets/images/search.png";
        }
        if (haspermission) {
          nav_items.push(navs);
          // console.log(nav_items);
          this.storage.setData("permisionGurds", JSON.stringify(nav_items));
        }
      }
    });

    this.navItems = nav_items;
    this.commonService.setPermissionNavItems(nav_items);
    if (type === "board-selection") {
      window.location.reload();
    }
  }
  getNavItems() {
    let leftNavs = this.storage.getData("leftNavs");
    let roles_data = this.storage.getData("roles_data");
    let pagePermission = this.storage.getData("pagePermission");
    if (leftNavs && roles_data && pagePermission) {
      const params = {
        result: {
          leftNavs: JSON.parse(leftNavs),
          userRole: JSON.parse(roles_data),
          permissions: JSON.parse(pagePermission),
        },
      };
      this.shuffleSideNavs(params, "non-board-selection");
    } else {
      this.loginService
        .selectBoardAndRolesAndPermission({
          boardId: this.storage.getData("loggedInBoard"),
        })
        .subscribe((response: any) => {
          const userToken = {
            token: response.result.token.accessToken,
            expiry: response.result.token.expiry,
          };
          this.storage.setData("userToken", JSON.stringify(userToken));
          if (response) {
            this.shuffleSideNavs(response, "non-board-selection");
            this.storage.setData("board", JSON.stringify(response));
            this.storage.setData(
              "roles_data",
              JSON.stringify(response.result.userRole)
            );
            this.storage.setData(
              "pagePermission",
              JSON.stringify(response.result.permissions)
            );
          }
        });
    }
  }
  navigateTo(params: any) {
    this.storage.setData("rolePermission", JSON.stringify(params));
    if (params.name == "Documents") {
      this.sideMenuFlag = !this.sideMenuFlag;
    }
    if (params.name == "Search") {
      this.topMenuFlag = !this.topMenuFlag;
    }
    var permissionRequired: any;
    var loginDetails: any;
    permissionRequired = Object.values(params.permission[params.component]);
    if (params.component === "UserAdministration" && permissionRequired) {
      if (params.permission["CommitteeAdministration"]) {
        permissionRequired = [
          ...permissionRequired,
          ...params.permission["CommitteeAdministration"],
        ];
      }
      if (params.permission["OfficerGroupAdministration"]) {
        permissionRequired = [
          ...permissionRequired,
          ...params.permission["OfficerGroupAdministration"],
        ];
      }
    }
    loginDetails = {
      userInfo: params,
      userResponsibility: permissionRequired,
    };
    this.storage.setData(
      "userPermission",
      JSON.stringify(loginDetails.userResponsibility)
    );
    if (loginDetails) {
      if (loginDetails.userInfo.name === "Profiles") {
        this.router.navigate(["profile"], { relativeTo: this.activateRoute });
      } else if (loginDetails.userInfo.name === "Links") {
        this.router.navigate(["links"], { relativeTo: this.activateRoute });
      } else if (loginDetails.userInfo.name === "Alerts") {
        this.router.navigate(["alerts"], { relativeTo: this.activateRoute });
      } else if (loginDetails.userInfo.name === "Surveys") {
        this.router.navigate(["surveys"], { relativeTo: this.activateRoute });
      } else if (loginDetails.userInfo.name === "Meetings & Events") {
        this.router.navigate(["meetings"], { relativeTo: this.activateRoute });
      } else if (loginDetails.userInfo.name === "Admin") {
        this.router.navigate(["admin/user"]);
      } else if (loginDetails.userInfo.name === "Evaluations") {
        this.router.navigate(["evaluations"], {
          relativeTo: this.activateRoute,
        });
      } else if (
        loginDetails.userInfo.name === "Voting" ||
        loginDetails.userInfo.component === "Votings"
      ) {
        this.router.navigate(["votings"], { relativeTo: this.activateRoute });
      } else {
        //this.router.navigate([""]);
      }
    }
  }
  boardModal(params: any) {
    this.isShowBoardsModal = true;
    this.boardDetails = params;
    const dialogRef = this.dialogService.open({
      content: ConfirmModalComponent,
    });
    const info = dialogRef.content.instance;
    info.headerTitle = "Change Boards";
    info.bodyMessage = this.boardDetails ? this.boardDetails : params;
    info.isEnableHeader = true;
    info.isEnableBody = true;
    info.isEnableFooter = false;
    dialogRef.result.subscribe((result: any) => {
      if (result.board) this.switchBoard(result.board);
    });
  }
  closeDialog(e: any) {
    this.isShowBoardsModal = e;
  }
  switchBoard(e: any) {
    let currentBoard: any = this.storage.getData("loggedInBoard");
    if (currentBoard === e.clientBoardId) {
      alert("Your are already in this board");
    } else {
      const request: any = {
        boardId: e.clientBoardId,
      };
      this.loginService.selectBoardAndRolesAndPermission(request).subscribe(
        (res: any) => {
          if (res.result) {
            const userToken = {
              token: res.result.token.accessToken,
              expiry: res.result.token.expiry,
            };
            this.storage.setData("loggedInBoard", e.clientBoardId);
            this.storage.setData("userToken", JSON.stringify(userToken));
            this.shuffleSideNavs(res, "board-selection");
            this.storage.setData(
              "roles_data",
              JSON.stringify(res.result.userRole)
            );
            this.storage.setData(
              "pagePermission",
              JSON.stringify(res.result.permissions)
            );
            this.storage.setData(
              "leftNavs",
              JSON.stringify(res.result.leftNavs)
            );
          }
        },
        (err) => {}
      );
    }
  }
  clickLogo(e: any) {
    this.router.navigate(["admin"]);
  }

  subMenuOnClick(data: any) {
    console.log(data);
    this.router.navigate([`${data.e.link}`], {
      relativeTo: this.activateRoute,
    });
    if (data.type == "sideNav") {
      this.sideMenuFlag = !this.sideMenuFlag;
    } else if (data.type == "topNav") {
      this.topMenuFlag = !this.topMenuFlag;
    }
  }

  // onClick(event: any) {
  //   if (!this._eref.nativeElement.contains(event.target)) // or some similar check
  //     this.sideMenuFlag = false;
  // }

  InitIntercom() {
    this.intercomService.initIntercom();
  }

  DestroyIntercom() {
    this.intercomService.destroyIntercom();
  }
}
