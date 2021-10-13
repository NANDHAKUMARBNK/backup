import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ActivatedRoute, Router } from "@angular/router";
import { OfficerGroupService } from "lib-bw-svc-apis/src/lib/officer-group/officer-group.service";
import { CommitteesService } from "lib-bw-svc-apis/src/lib/committees/committees.service";
import { Component, OnInit } from "@angular/core";
import { AdminUsersService } from "lib-bw-svc-apis/src/lib/admin-users/admin-users.service";
import { FormControl } from "@angular/forms";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  labelName = "User Administration";
  isCommitteeRelatedInfo: boolean = true;
  selectField = new FormControl();
  users: any;
  defaultCommitteeItem = {
    committeeName: "Search Committee",
    clientBoardId: "",
  };
  defaultSortItem = { name: "Committee", value: "committee" };
  tabName: any = "users";
  tabsData: any = [];
  tab: boolean = true;
  accordions: any;
  isCommitteeGrid: boolean = true;
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsDataAdminUser: any = [
    {
      field: "adminUsers",
      title: "USERS BY COMMITTEE",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "admin_users",
    },
  ];
  columnsData: any = [
    // {
    //   field: "name",
    //   title: "SENIOR OFFICER GROUPS",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    // },
    {
      field: "useTemplate",
      title: "SENIOR OFFICER GROUPS",
      component: "useTemplate",
      isEnableColumnOptions: false,
    },
    {
      field: "deleteTextName",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "deletelink",
    },
    {
      field: "linkTextName",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
  ];
  committees: any = [];
  groups: any = [];
  sortBy = [
    // { name: "Committee", value: "committee" },
    { name: "Role", value: "role" },
  ];
  usersRoles: any;
  gridData: any;
  userPermission: any;
  isShowViewUsers: boolean = false;
  isShowCommittees: boolean = false;
  isShowGroups: boolean = false;
  errMessage: any;
  isError: boolean = false;
  isShowAddCommittees: boolean = false;
  isShowEditCommittees: boolean = false;
  isShowAddGroups: boolean = false;
  isShowEditGroups: boolean = false;
  userTabData = {
    title: "USERS",
    content: "",
    isSelected: true,
    isDisabled: true,
  };
  groupTabData = {
    title: "OFFICER GROUPS",
    content: "This is OFFICE GROUPS Tab",
    isSelected: false,
    isDisabled: false,
  };
  committeeTabData = {
    title: "COMMITTEES",
    content: "This is COMMITTEES Tab",
    isSelected: false,
    isDisabled: false,
  };
  showdeleteLink: boolean = false;
  selectedData: any;
  constructor(
    private adminService: AdminUsersService,
    private committeesService: CommitteesService,
    private officerGroupService: OfficerGroupService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private storage: StorageService
  ) {}
  ngOnInit(): void {
    this.userPermission = JSON.parse(this.storage.getData("userPermission"));
    this.userPermission &&
      this.userPermission.forEach((element: any) => {
        if (
          element.action == "ViewUsers" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowViewUsers = true;
          // this.tabsData.push(this.userTabData);
        }
        if (
          element.action == "ViewGroups" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowGroups = true;
          // this.tabsData.push(this.groupTabData);
        }
        if (
          element.action == "ViewCommittees" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowCommittees = true;
          // this.tabsData.push(this.committeeTabData);
        }
        if (
          element.action == "AddCommittees" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowAddCommittees = true;
        }
        if (
          element.action == "EditCommittees" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowEditCommittees = true;
        }
        if (
          element.action == "AddGroups" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowAddGroups = true;
        }
        if (
          element.action == "EditGroups" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowEditGroups = true;
        }
      });
    this.isShowViewUsers ? this.tabsData.push(this.userTabData) : false;
    this.isShowGroups ? this.tabsData.push(this.groupTabData) : false;
    this.isShowCommittees ? this.tabsData.push(this.committeeTabData) : false;
    this.getUserCommittees();
    const tab = this.activateRoute.snapshot.queryParams.tab;
    this.tabChange(
      tab === "groups"
        ? { title: "OFFICER GROUPS" }
        : tab === "committees"
        ? { title: "COMMITTEES" }
        : ""
    );
  }
  shuffleDataForAccordion(params: any, type: any) {
    let tempArr: any = [];
    params.forEach((item: any) => {
      tempArr.push({
        id: type == "committee" ? item.committeeId : item.roleId,
        header: type == "committee" ? item.committeeName : item.roleName,
        body: item.users,
      });
    });
    this.accordions = tempArr;
    this.gridData = [
      {
        adminUsers: this.accordions,
      },
    ];
  }
  mailTo(e: any) {
    window.location.href = `mailto:${e}`;
  }
  getUserCommittees() {
    this.adminService.getAdminUsersCommittee().subscribe(
      (response: any) => {
        if (response.result) {
          this.users = response.result;
          // if (this.users) {
          //   this.users.sort((a: any, b: any) =>
          //     a.committeeName.toLowerCase() > b.committeeName.toLowerCase()
          //       ? 1
          //       : -1
          //   );
          // }
          this.shuffleDataForAccordion(this.users, "committee");
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  getUsersByRole() {
    this.adminService.getUsersByRole().subscribe(
      (res) => {
        if (res.result) {
          this.users = res.result;
          if (this.users) {
            this.users.sort((a: any, b: any) =>
              a.roleName.toLowerCase() > b.roleName.toLowerCase() ? 1 : -1
            );
          }
          this.shuffleDataForAccordion(this.users, "role");
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  tabChange(event: any) {
    if (event.title == "OFFICER GROUPS") {
      this.tab = false;
      this.tabName = "groups";
      this.labelName = "Officer Group Administration";
      this.columnsData[0].title = "SENIOR OFFICER GROUPS";
      this.getOfficerGroups();
      this.selecttab("groups");
      this.router.navigate(["."], {
        relativeTo: this.activateRoute,
        queryParams: { tab: "groups" },
      });
    } else if (event.title == "COMMITTEES") {
      this.tabName = "committees";
      this.labelName = "Committee Administration";
      this.columnsData[0].title = "COMMITTEES";
      this.selecttab("committees");
      this.getCommittees();
      this.router.navigate(["."], {
        relativeTo: this.activateRoute,
        queryParams: { tab: "committees" },
      });
      this.tab = true;
    } else {
      this.tab = true;
      this.labelName = "User Administration";
      this.selecttab("users");
      this.tabName = "users";
      this.router.navigate(["."], { relativeTo: this.activateRoute });
    }
    console.log(this.tabName, event);
  }

  selecttab(tab: any) {
    this.tabsData[0].isSelected = tab === "users" ? true : false;
    this.tabsData[0].isSelected = tab === "users" ? true : false;
    this.tabsData[1].isSelected = tab === "groups" ? true : false;
    this.tabsData[1].isSelected = tab === "groups" ? true : false;
    this.tabsData[2].isSelected = tab === "committees" ? true : false;
    this.tabsData[2].isSelected = tab === "committees" ? true : false;
  }

  navigateTo(e: any) {
    if (e == "group") {
      this.router.navigate([`./groups`], { relativeTo: this.activateRoute });
    } else if (e == "committee") {
      this.router.navigate([`./committees`], {
        relativeTo: this.activateRoute,
      });
    }
  }
  linksModalAction(type: any) {
    if (type == "save") {
      this.deleteTemplate(this.selectedData.data.committeeId);
    } else {
      this.showdeleteLink = false;
      this.selectedData = "";
    }
  }
  onClickLink(e: any, type: any) {
    if (type == "groups") {
      this.router.navigate([`./groups/edit/${e.data.groupId}`], {
        relativeTo: this.activateRoute,
      });
    } else if (type == "committees") {
      if (e.type === "link") {
        this.router.navigate([`./committees/edit/${e.data.committeeId}`], {
          relativeTo: this.activateRoute,
        });
      } else if (e.type == 'deletelink') {
        this.showdeleteLink = true;
        this.selectedData = e;
      } else {
        this.router.navigate([`./committees/edit/${e.data.committeeId}`], {
          relativeTo: this.activateRoute,
        });
      }
    }
  }
  deleteTemplate(commId: any) {
    this.adminService.deleteCommittee(commId).subscribe((res: any) => {
      if (res) {
        this.showdeleteLink = false;
        this.toastr.showToastr(
          "success",
          "Admin Committee Deleted Successfully!"
        );
        this.getCommittees();
        this.router.navigate(["."], {
          relativeTo: this.activateRoute,
          queryParams: { tab: "committees" },
        });
      }
    });
  }
  getCommittees() {
    this.committeesService.getCommittees().subscribe(
      (data: any) => {
        if (data) {
          this.committees = data.result;
          data.result.filter((res: any) => {
            if (res.canEdit && this.isShowEditCommittees) {
              res["linkTextName"] = "Edit";
              res["useTemplate"] = res.name;
            }
            if (res.canDelete) {
              res["deleteTextName"] = "Delete";
            }
          });
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  getOfficerGroups() {
    this.officerGroupService.getOfficerGroups().subscribe(
      (data: any) => {
        if (data) {
          this.groups = data.result;
          data.result.filter((res: any) => {
            if (res.canEdit && this.isShowEditGroups) {
              res["linkTextName"] = "Edit";
              res["useTemplate"] = res.name;
            }
          });
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  onChangeCommittee(e: any) {
    let filterData: any = this.users.filter(
      (item: any) => item.committeeId === e
    );
    if (filterData.length) {
      this.shuffleDataForAccordion(filterData, "committee");
    }
  }
  edit(e: any) {
    this.router.navigate([`./edit/${e.rowCellData.userId}`], {
      relativeTo: this.activateRoute,
    });
  }
  reports(e: any) {
    this.router.navigate(["admin/user/reports"]);
  }
  /// Sorting Option for Users
  onSelect(e: any) {
    switch (e) {
      case "committee":
        this.columnsDataAdminUser = [
          {
            field: "",
            title: "USERS BY COMMITTEE",
            filterType: "text",
            isEnableColumnOptions: false,
            component: "admin_users",
          },
        ];
        this.getUserCommittees();
        break;
      case "role":
        this.columnsDataAdminUser = [
          {
            field: "",
            title: "USERS BY ROLE",
            filterType: "text",
            isEnableColumnOptions: false,
            component: "admin_users",
          },
        ];
        this.getUsersByRole();
        break;
      default:
        return;
    }
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
