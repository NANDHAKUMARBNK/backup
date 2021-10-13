import { EntitiesService } from "lib-bw-svc-apis/src/lib/entities/entities.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommitteesService } from "lib-bw-svc-apis/src/lib/committees/committees.service";
import { OfficerGroupService } from "lib-bw-svc-apis/src/lib/officer-group/officer-group.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-create-groups",
  templateUrl: "./create-groups.component.html",
  styleUrls: ["./create-groups.component.scss"],
})
export class CreateGroupsComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Administration",
      title: "Administration",
    },
    {
      text: "Add Officer Group",
      title: "Add Officer Group",
    },
  ];
  groupMembersForm: FormGroup;
  users: any;
  committees: any;
  userId: any;
  selectedUsers: any;
  selectedCommittees: any;
  isEditMode: boolean = false;
  isError = false;
  errMessage: any = [];
  groupId: any;
  groupInfoMessage =
    "To assign users as members of the Officer Group, select the users below.";
  committeesInfoMessage =
    "To associate the Officer Group with one or more committees, select the committees below.";
  buttonProperties: any = [
    {
      buttonText: "CANCEL",
      className:
        "btn-base  secondary-btn-text border-secondary bw-font-prm-medium btn-sm  me-md-4 px-4",
      buttonAction: "Cancel",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
    {
      buttonText: "SAVE",
      className:
        "btn-base  btn-containe bw-font-prm-medium  secondary-btn-contained btn-sm  me-md-4 px-4",
      buttonAction: "Save",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
  ];
  groupsData: any;
  constructor(
    private fb: FormBuilder,
    private officerGroupService: OfficerGroupService,
    private committeesService: CommitteesService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private entities: EntitiesService,
    private location: Location,
    private router: Router
  ) {
    if (
      this.activateRoute.snapshot.params &&
      this.activateRoute.snapshot.params.id
    ) {
      this.groupId = this.activateRoute.snapshot.params.id;
      this.isEditMode = true;
    }
    this.groupMembersForm = this.fb.group({
      name: [{ value: "", disabled: this.isEditMode }, [Validators.required]],
      description: [{ value: "", disabled: this.isEditMode }],
      committeeIds: [[]],
      groups: [""],
      userIds: [[]],
    });
    // this.buttonProperties[1].buttonText = this.isEditMode ? "UPDATE" : "SAVE";
    // this.buttonProperties[1].buttonAction = this.isEditMode ? "Update" : "Save";
  }

  ngOnInit(): void {
    this.getCommittees();
    this.getUsers();
  }

  getCommittees() {
    this.committeesService.getCommittees().subscribe(
      (data: any) => {
        if (data) {
          this.committees = data.result;
          this.committees.filter((c: any) => {
            c["value"] = c.committeeId;
          });
          if (this.isEditMode) {
            this.getOfficerGroupById();
          }
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
  }

  getUsers() {
    this.entities.getUsers().subscribe(
      (data: any) => {
        if (data) {
          this.users = data.result;
          this.users.filter((c: any) => {
            c["value"] = c.userId;
          });
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
  }

  getOfficerGroupById() {
    this.officerGroupService.getOfficerGroupById(this.groupId).subscribe(
      (res: any) => {
        if (res.result) {
          this.groupMembersForm.patchValue(res.result);
          this.groupsData = res.result;
          /// Patching already assigned users to users listing
          this.users.filter((list: any) => {
            res.result.userIds.filter((assignedIds: any) => {
              if (list.userId == assignedIds) {
                list["selected"] = true;
              }
            });
          });
          /// Patching already assigned committees to committees listing
          this.committees.filter((list: any) => {
            res.result.committeeIds.filter((assignedIds: any) => {
              if (list.committeeId == assignedIds) {
                list["selected"] = true;
              }
            });
          });
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
  }

  clickButton(e: any) {
    let data = {
      name: this.groupMembersForm.value.name ? this.groupMembersForm.value.name : this.groupsData && this.groupsData.name ? this.groupsData.name : '',
      description: this.groupMembersForm.value.description ? this.groupMembersForm.value.description : this.groupsData && this.groupsData.description ? this.groupsData.description : '',
      userIds: this.selectedUsers
        ? [...this.selectedUsers.map((item: { value: any }) => item.value)]
        : this.groupMembersForm.value.userIds || [],
      committeeIds: this.selectedCommittees
        ? [...this.selectedCommittees.map((item: { value: any }) => item.value)]
        : this.groupMembersForm.value.committeeIds || [],
    };
    if (e == "Save") {
      /// TODO: Add Groups API
      this.officerGroupService.createOfficerGroups(data).subscribe((res) => {
        if (res) {
          this.toastr.showToastr(
            "success",
            "Group Members Created Successfully!"
          );
          this.getOfficerGroupById();
          this.location.back();
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
    } else if (e == "Cancel") {
      this.location.back();
      this.groupMembersForm.reset();
    } else if (e == "Update") {
      /// Edit Groups API
      this.officerGroupService
        .updateOfficerGroups(data, this.groupId)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr(
              "success",
              "Group Members Updated Successfully!"
            );
            this.getOfficerGroupById();
            this.location.back();
          }
        }, err => {
          this.setError(err.error.result.errorMessages);
        });
    }
  }

  seterror(e: any) { }

  onPanelChange(e: any) { }

  changeCheckbox(e: any, type?: any) {
    if (type == "committee") {
      this.selectedCommittees = e;
    } else if (type == "group") {
      this.selectedUsers = e;
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  navigateInto(params: any) {
    if (params.text === "Administration" || params.title === "Administration") {
      if (this.isEditMode) {
        this.router.navigate(['../../../'], { relativeTo: this.activateRoute })
      } else {
        this.router.navigate(['../'], { relativeTo: this.activateRoute })
      }
    }
  }
}
