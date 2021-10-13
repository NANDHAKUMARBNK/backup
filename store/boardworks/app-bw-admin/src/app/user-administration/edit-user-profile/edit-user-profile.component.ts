import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { OfficerGroupService } from "./../../../../../lib-bw-svc-apis/src/lib/officer-group/officer-group.service";
import { CommitteesService } from "./../../../../../lib-bw-svc-apis/src/lib/committees/committees.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AdminUsersService } from "lib-bw-svc-apis/src/lib/admin-users/admin-users.service";
import { EntitiesService } from "lib-bw-svc-apis/src/lib/entities/entities.service";
import { Location } from "@angular/common";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.component.html",
  styleUrls: ["./edit-user-profile.component.scss"],
})
export class EditUserProfileComponent implements OnInit {
  userDataForm: FormGroup;
  userData: any;
  userId: any;
  roles: any;
  appointments: any;
  committees: any;
  isError = false;
  errMessage: any = [];
  groups: any;
  meetingViewSettings: any;
  defaultItems: any = [
    {
      text: "Administration",
      title: "Administration",
    },
    {
      text: "Edit ",
      title: "Edit ",
    }
  ];
  buttonProperties: any = [
    {
      buttonText: "CANCEL",
      className:
        "btn-base btn-contained secondary-btn-outlined btn-lg bw-font-sec-bold",
      buttonAction: "Cancel",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
    {
      buttonText: "SAVE",
      className:
        "btn-base btn-contained secondary-btn-contained btn-lg bw-font-sec-bold me-md-4",
      buttonAction: "Save",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
  ];
  resetPasswordSettings: any = [
    {
      name: "Force password change on next login",
      value: "Force password change on next login",
      selected: false,
    },
  ];
  loginHistory: any = [
    {
      name: "Force a Remote wipe on a user's BoardWork's App Vault",
      value: "Force a Remote wipe on a user's BoardWork's App Vault",
      selected: false,
    },
  ];
  selectField = new FormControl();
  defaultSortItem = { name: "VIEW HISTORY", value: "" };
  defaultAppointment = { name: "SELECT APPOINTMENT", value: "" };
  meetingSettings: any = [
    {
      name: "Default Calendar Meeting View",
      value: "Default Calendar Meeting View",
      selected: false,
    },
  ];
  meetingTooltipText: any = " ";
  passwordTooltipText: any = " ";
  historyTooltipText: any =
    "If you have security concerns, you can wipe this user vault, to ensure your board information remains secure.";
  rolesInfoMessage: any =
    "Whilst the changes in role-based permissions are effective immediately, It may take several minutes for the changes to reflect in the Board Resource Centre. ";
  resetPasswordData: any = [];
  checkBoxses: any;
  isShowViewHistory: boolean = false;
  deviceGridData: any;
  isShowResetPassword: boolean = true;
  userName: any;
  constructor(
    private adminUserService: AdminUsersService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private entities: EntitiesService,
    private committeesService: CommitteesService,
    private groupService: OfficerGroupService,
    private toastr: ToastrService,
    private storage: StorageService
  ) {
    this.userDataForm = this.fb.group({
      name: [""],
      username: [""],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      isMeetingCalendarView: [false],
      forcePasswordChangeAtLogon: [false],
      forceDeviceWipe: [false],
      roleId: [""],
      appointmentId: [""],
      commiteeIds: [""],
      seniorOfficerGroupIds: [""],
    });
    this.userId = this.activatedRoute.snapshot.params.id;
    this.getCommittees();
    this.getOfficerGroups();
    this.getRoles();
    this.getAppointments();
  }

  ngOnInit(): void {
    this.getAdminUserById(this.userId);
    if (
      JSON.parse(this.storage.getData("user")).userId ===
      this.activatedRoute.snapshot.params.id
    ) {
      this.isShowResetPassword = false;
    }
  }
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "deviceId",
      title: "DEVICE ID",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "state",
      title: "STATE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  shuffleDataForCheckbox(data: any) {
    if (data && data.commiteeIds.length) {
      let tempArr: any = [];
      this.committees.map((item: any) => {
        tempArr.push({
          name: item.name,
          value: item.value,
          selected:
            data.commiteeIds.filter((ele: any) => ele === item.value).length !==
            0,
        });
      });
      this.committees = tempArr;
    }
    if (data && data.seniorOfficerGroupIds.length) {
      let tempArr: any = [];
      this.groups.map((item: any) => {
        tempArr.push({
          name: item.name,
          value: item.value,
          selected:
            data.seniorOfficerGroupIds.filter((ele: any) => ele === item.value)
              .length !== 0,
        });
      });
      this.groups = tempArr;
    }
    if (data && data.roleId) {
      let tempArr: any = [];
      this.roles.map((item: any) => {
        tempArr.push({
          name: item.name,
          value: item.value,
          selected: item.roleId === data.roleId ? true : false,
        });
      });
      this.roles = tempArr;
    }
    // if (data.isPasswordExpired) {
    //   this.loginHistory = [
    //     {
    //       name: "Force a remote wipe on a user's board app vault",
    //       value: "Force a remote wipe on a user's board app vault",
    //       selected: data.isPasswordExpired,
    //     },
    //   ];
    // }
    if (data && data.isChangePasswordAtLogon) {
      this.resetPasswordSettings = [
        {
          name: "Force password change when on next login",
          value: "Force password change when on next login",
          selected: data.isChangePasswordAtLogon,
        },
      ];
    }
    if (data && data.isMeetingCalendarView) {
      this.meetingSettings = [
        {
          name: "Default Calendar Meeting View",
          value: "Default Calendar Meeting View",
          selected: data.isMeetingCalendarView,
        },
      ];
    }
    if (data && data.devices && data.devices.length) {
      let devTempArr: any = [];
      data.devices.map((element: any) => {
        devTempArr.push({
          deviceId: element.deviceId,
          state: element.isGlobalWipe
            ? "Wipe Global"
            : !element.isGlobalWipe && element.isBoardWipe
              ? "Wipe Pending (Board)"
              : element.isGlobalWipe && element.isBoardWipe
                ? "Wipe Global"
                : "idle",
        });
      });
      this.deviceGridData = devTempArr;
    }
    // this.userDataForm.patchValue({
    //   seniorOfficerGroupIds: this.groups,
    //   commiteeIds: this.committees,
    //   roleId: this.roles,
    // });
  }
  navigateInto(params: any) {
    if (params.text === "Administration" || params.title === "Administration") {
      // this.route.navigate(["admin/user"]);
      this.location.back();
    }
  }

  async getAdminUserById(id: any) {
    await this.adminUserService.getAdminUserById(id).subscribe(
      (res) => {
        if (res && res.result) {
          this.userData = res.result;
          let breadCrumbObject: any = [
            {
              title: res.result.name,
              text: res.result.name,
            },
          ];
          this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
          this.shuffleDataForCheckbox(this.userData);
          this.userDataForm.patchValue(res.result);
          if (!this.userData.canEditPersonalInfo) {
            this.userDataForm.get("firstName")?.disable();
            this.userDataForm.get("lastName")?.disable();
            this.userDataForm.get("email")?.disable();
            this.userData.get("isMeetingCalendarView")?.disable();
          }
          if (!this.userData.canEditRoles) {
            this.userDataForm.get("roleId")?.disable();
          }
          if (!this.userData.canEditCommittees) {
            this.userDataForm.get("commiteeIds")?.disable();
          }
          if (!this.userData.canEditGroups) {
            this.userDataForm.get("seniorOfficerGroupIds")?.disable();
          }
          if (!this.userData.canResetForcePassword) {
            this.userDataForm.get("forcePasswordChangeAtLogon")?.disable();
          }
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  async getRoles() {
    await this.entities.getRoles().subscribe(
      (res) => {
        if (res && res.result) {
          this.roles = res.result;
          this.roles.filter((r: any) => {
            r["value"] = r.roleId;
            r["selected"] = false;
          });

          if (this.userData) {
            this.shuffleDataForCheckbox(this.userData);
            this.userDataForm.patchValue(this.userData);
          }
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  async getAppointments() {
    await this.entities.getAppointments().subscribe(
      (res) => {
        if (res && res.result) {
          this.appointments = res.result;
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  async getCommittees() {
    await this.committeesService.getCommittees().subscribe(
      (data: any) => {
        if (data) {
          this.committees = data.result;
          this.committees.filter((c: any) => {
            c["value"] = c.committeeId;
            c["selected"] = false;
          });
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  async getOfficerGroups() {
    await this.groupService.getEntitiesGroups().subscribe(
      (data: any) => {
        if (data) {
          this.groups = data.result;
          this.groups.filter((g: any) => {
            g["value"] = g.groupId;
            g["selected"] = false;
          });
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  seterror(e: any) { }

  onPanelChange(e: any) { }

  changeCheckbox(e: any, type: any) {
    if (type == "committee") {
      this.userDataForm
        .get("commiteeIds")
        ?.setValue([...e.map((item: any) => item.value)]);
    } else if (type == "group") {
      this.userDataForm
        .get("seniorOfficerGroupIds")
        ?.setValue([...e.map((item: any) => item.value)]);
    } else if (type === "resetPasswordSettings") {
      this.userDataForm
        .get("forcePasswordChangeAtLogon")
        ?.setValue(
          this.resetPasswordSettings.map((item: any) => item.selected)[0]
        );
    } else if (type === "loginHistory") {
      this.userDataForm
        .get("forceDeviceWipe")
        ?.setValue(this.loginHistory.map((item: any) => item.selected)[0]);
    } else if (type === "meeting") {
      this.userDataForm
        .get("isMeetingCalendarView")
        ?.setValue(this.meetingSettings.map((item: any) => item.selected)[0]);
    } else if (type == "role") {
      this.userDataForm.get("roleId")?.setValue(e);
    }
  }

  changeAppointment(e: any) { }

  onSelect(e: any) { }
  resetPassword() {
    this.adminUserService.postAdminResetPasswordById(this.userId).subscribe(
      (response: any) => {
        console.log(response, "res");
        if (response) {
          alert(
            "Password was successfully reset and an email was sent to the user"
          );
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  clickButton(e: any) {
    if (e == "Save") {
      this.adminUserService
        .updateAdminUserById(this.userId, this.userDataForm.value)
        .subscribe(
          (res) => {
            if (res && res.result) {
              this.userDataForm.patchValue(res.result);
              this.toastr.showToastr(
                "success",
                `Profile Updated Successfully.`
              );
              this.getAdminUserById(this.userId);
              this.location.back();
            }
          },
          (err) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    } else if (e == "Cancel") {
      this.location.back();
      this.userDataForm.reset();
    }
  }
  viewHistory() {
    this.isShowViewHistory = !this.isShowViewHistory;
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
