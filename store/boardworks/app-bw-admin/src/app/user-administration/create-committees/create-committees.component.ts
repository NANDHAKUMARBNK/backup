import { EntitiesService } from "lib-bw-svc-apis/src/lib/entities/entities.service";
import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CommitteesService } from "lib-bw-svc-apis/src/lib/committees/committees.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-create-committees",
  templateUrl: "./create-committees.component.html",
  styleUrls: ["./create-committees.component.scss"],
})
export class CreateCommitteesComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Administration",
      title: "Administration",
    },
    {
      text: "Add Committee",
      title: "Add Committee",
    },
  ];
  adminForm: any;
  users: any;
  selectedCommittees: any;
  isEditMode: boolean = false;
  committeeId: any;
  isError = false;
  errMessage: any = [];
  committeesInfoMessage =
    "To assign users as members of the Committee, select the users below.";
  buttonProperties: any = [
    {
      buttonText: "CANCEL",
      className:
        "btn-base btn-contained secondary-btn-outlined btn-lg btn-size",
      buttonAction: "Cancel",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
    {
      buttonText: "SAVE",
      className:
        "btn-base btn-contained secondary-btn-contained btn-lg btn-size",
      buttonAction: "Save",
      isDisable: false,
      withIcon: false,
      showButton: true,
    },
  ];
  constructor(
    private fb: FormBuilder,
    private committeesService: CommitteesService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private entities: EntitiesService,
    private location: Location,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      name: ["", [Validators.required]],
      description: [""],
      userIds: [[]],
    });
    if (
      this.activateRoute.snapshot.params &&
      this.activateRoute.snapshot.params.id
    ) {
      this.committeeId = this.activateRoute.snapshot.params.id;
      this.isEditMode = true;
    }
    // this.buttonProperties[1].buttonText = this.isEditMode ? 'UPDATE' : 'SAVE';
    // this.buttonProperties[1].buttonAction = this.isEditMode ? "Update" : "Save";
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.entities.getUsers().subscribe(
      (data: any) => {
        if (data) {
          this.users = data.result;
          this.users.filter((c: any) => {
            c["value"] = c.userId;
          });
          if (this.isEditMode) {
            this.getCommitteesById();
          }
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
       }
    );
  }

  getCommitteesById() {
    this.committeesService
      .getCommitteesById(this.committeeId)
      .subscribe((res) => {
        if (res.result) {
          this.adminForm.patchValue(res.result);
          this.users = this.users.map((list: any) => {
            const id: any = res.result.userIds.findIndex((assignedIds: any) => assignedIds === list.userId);
            if (id !== -1) {
              list["selected"] = true;
            }
            return list;
          });
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
  }

  clickButton(e: any) {
    let data = {
      name: this.adminForm.value.name,
      description: this.adminForm.value.description,
      userIds: this.selectedCommittees
        ? [...this.selectedCommittees.map((item: { value: any }) => item.value)]
        : this.adminForm.value.userIds || [],
    };
    if (e == "Save") {
      if (this.adminForm.invalid) {
        this.adminForm.markAllAsTouched();
        return;
      }
      /// Add Committees API
      this.committeesService.createCommittees(data).subscribe((res) => {
        if (res) {
          this.toastr.showToastr("success", "Committees Created Successfully!");
          this.getCommitteesById();
          this.location.back();
        }
      }, err => {
        this.setError(err.error.result.errorMessages);
      });
    } else if (e == "Cancel") {
      this.adminForm.reset();
      this.location.back();
    } else if (e == "Update") {
      /// Edit Committees API
      console.log(this.adminForm.value, this.selectedCommittees);
      this.committeesService
        .updateCommittees(data, this.committeeId)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr(
              "success",
              "Committees Updated Successfully!"
            );
            this.getCommitteesById();
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
    console.log(this.adminForm.value, e);
    if (type == "committee") {
      this.selectedCommittees = e;
      const value = this.selectedCommittees
        && [...this.selectedCommittees.map((item: { value: any }) => item.value)];
      this.adminForm.get('userIds').setValue(value.length ? value : []);
      this.adminForm.updateValueAndValidity();
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
