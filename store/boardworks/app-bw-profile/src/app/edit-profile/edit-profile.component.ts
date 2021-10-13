import { ToastrService } from "./../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ProfileService } from "./../../../../lib-bw-svc-apis/src/lib/profile/profile.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EntitiesService } from "lib-bw-svc-apis/src/lib/entities/entities.service";
import { Location } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";

import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { DialogService } from "@progress/kendo-angular-dialog";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  profileDataForm: FormGroup;
  selectField = new FormControl();
  defaultItems: any = [
    {
      text: "Profiles",
      title: "Profiles",
    },
  ];
  countries: any;
  timezones: any;
  isCommitteeGrid: boolean = true;
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  onCellClicked: any = [];
  cardData = [
    {
      showText: true,
      title: "MY COMMITTEES",
      body: [],
    },
  ];
  iconProperties: any = [
    {
      className: "mdi mdi-square-edit-outline icon",
      showIcon: true,
      iconAction: "Edit",
    },
    {
      className: "mdi mdi-delete icon",
      showIcon: true,
      iconAction: "Delete",
    },
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
      buttonText: "CLEAR ALL",
      className:
        "btn-base btn-contained secondary-btn-outlined btn-lg bw-font-sec-bold",
      buttonAction: "Clear",
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
  alertMessage =
    "If you wish to edit the appointment, email address or username, please contact your Administrator";
  userId: any;
  columnOptions: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "name",
      title: "MY COMMITTEE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any = [];
  userData: any;
  image: any = "../assets/images/no-image.png";
  @ViewChild("fileupload") element!: ElementRef;
  fileUrl: any;
  profilePage: any;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private activateRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private entitiesService: EntitiesService,
    private route: Router,
    private location: Location,
    private http: HttpClient,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
  ) {
    this.profileDataForm = this.fb.group({
      userId: [""],
      name: [""],
      username: [""],
      hasPhoto: [""],
      status: ["", [Validators.maxLength(100)]],
      bio: ["", [Validators.maxLength(100)]],
      country: [""],
      timeZone: [""],
      company: ["", Validators.required],
      companyTitle: ["", Validators.required],
      mobilePhone: ["", [Validators.pattern("^[0-9_+-]{8,15}$")]],
      workPhone: [""],
      email: [""],
      workEmail: [""],
      assistantName: ["", [Validators.maxLength(50)]],
      assistantPhone: [""],
      assistantEmail: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
      description: ["", [Validators.maxLength(100)]],
      otherInfo: ["", [Validators.maxLength(100)]],
      linkedin: ["", [Validators.maxLength(50)]],
      twitter: ["", [Validators.maxLength(50)]],
      showTwitterFeed: [false],
      logonDate: [""],
      appointment: [""], // {value:'', disabled: true}
    });
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.params.id;
    this.profilePage = this.activateRoute.snapshot.params.page;
    const pagePermission = this.storageService.getData('pagePermission') && JSON.parse(this.storageService.getData('pagePermission'));
    let checkuser;
  
    if (this.userId == "My") {

    } else {
      if (pagePermission.Profiles) {
        checkuser = pagePermission.Profiles.filter((item: any)=> item.action ==="EditOtherProfiles" )
      }
    }
  
    if(checkuser && checkuser.length == 0){
      this.route.navigate(['admin/error'])
      return
    }
    this.getCountries();
    this.getTimeZones();

    this.getUserData(this.userId);
    this.getProfileImageById();
  }

  seterror(e?: any) { }

  iconClickEvent(e: any) {
    if (e == "Edit") {
      this.element.nativeElement.click();
    } else if (e == "Delete") {
      const dialogRef = this.dialogService.open({
        // Show component
        content: ConfirmModalComponent,

        //actions: [{ text: 'Cancel' }, { text: 'Yes', primary: true }]
      });

      const info = dialogRef.content.instance;
      info.headerTitle = "Delete Confirmation";
      info.bodyMessage = "Are you sure you want to delete this Image?";
      info.bodyDescrption = "bodyDescrption";
      info.isEnableHeader = true;
      info.isDeleteBody = true;
      info.isEnableFooter = true;

      dialogRef.result.subscribe((result: any) => {
        if (result.text == "Yes") {
          this.deleteProfileImage();
        }
      });
    }
  }

  uploadFile(e: any) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    const formData: FormData = new FormData();

    formData.append("file", file, file.name);
    console.log(file);

    this.profileService
      .uploadProfile(this.userId, formData)
      .subscribe((data: any) => {
        this.getProfileImageById();
        this.profileService.updateApiCallProfilePicture.emit(true);
      });
  }

  getProfileImageById() {
    let token = this.storageService.getData("userToken");
    const headers = new HttpHeaders().set("Authorization", "Bearer" + token);
    let url;

    url = ` ${environment.baseUrl}${apiConstant.profile}/${this.userId}/Image/large`

    this.http
      .get(
        `${url}`,
        { headers, responseType: "arraybuffer" }
      )
      .subscribe(
        (data: ArrayBuffer) => {
          try {
            const binArray = new Uint8Array(data);
            const fileBlob = new Blob([binArray], { type: "image/jpeg" });
            // this.image = window.URL.createObjectURL(fileBlob);
            console.log(this.image, "imagesss");
            this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
              window.URL.createObjectURL(fileBlob)
            );

            console.log(this.image, "fileUrlfileUrl");
          } catch (error) { }
        },
        (error) => {
          if (error.status == 404) {
            this.image = "assets/images/no-image.png";
          }
        }
      );
  }

  deleteProfileImage() {
    this.profileService.deleteProfileImage(this.userId).subscribe((res) => {
      this.getProfileImageById();
    });
  }

  getCountries() {
    this.entitiesService.getCountries().subscribe((res) => {
      if (res) {
        this.countries = res.result;
      }
    });
  }

  getTimeZones() {
    this.entitiesService.getTimezones().subscribe((res) => {
      if (res) {
        this.timezones = res;
      }
    });
  }

  onChange(e: any, type?: any) { }

  getUserData(id: any) {
    this.profileService.getProfileById(id).subscribe(
      (data: any) => {
        if (data) {
          this.userData = data.result;
          this.profileDataForm.patchValue(data.result);
          let tempArr: any = [];

          //this.gridData = data.result.commitees;
          data.result.commitees.map((item: any) => {
            tempArr.push({
              id: item.committeeId,
              bodyName: item.name,
            });
          });
          this.cardData[0].body = tempArr;
          let breadCrumbObject: any = [
            {
              title: data.result.name,
              text: data.result.name,
            },
          ];
          this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
        }
      },
      (error) => { }
    );
  }

  clickButton(e: any) {
    if (e == "Save") {
      if (this.profileDataForm.valid) {
        this.profileService
          .updateProfileById(this.userId, this.profileDataForm.value)
          .subscribe(
            (data: any) => {
              if (data) {
                this.toastrService.showToastr(
                  "success",
                  "Profile Updated Successfully!"
                );
              }
              this.location.back();
            },
            (error) => { }
          );
      } else {
        this.toastrService.showToastr(
          "error",
          "Please fill all required fields!"
        );
      }
    } else if (e == "Clear") {
      this.profileDataForm.reset();
    } else if (e == "Cancel") {
      this.location.back();

      // this.profileDataForm.reset();
      // this.profileDataForm.patchValue(this.userData);
    }
  }
  navigateInto(params: any) {
    if (params.text === "Profiles" || params.title === "Profiles") {
      this.route.navigate([`admin/profile/view/${this.userId}`]);
    }
  }

  cancel(event: any) {
    this.location.back();
  }

  clearAll(event: any) {
    // this.profileDataForm.reset();    
    this.profileDataForm.get('name')?.setValue('');
    this.profileDataForm.get('hasPhoto')?.setValue(true);
    this.profileDataForm.get('status')?.setValue('');
    this.profileDataForm.get('bio')?.setValue('');
    this.profileDataForm.get('country')?.setValue('');
    this.profileDataForm.get('timeZone')?.reset();
    this.profileDataForm.get('company')?.setValue('');
    this.profileDataForm.get('companyTitle')?.setValue('');
    this.profileDataForm.get('mobilePhone')?.setValue('');
    this.profileDataForm.get('workPhone')?.reset();
    this.profileDataForm.get('workEmail')?.reset();
    this.profileDataForm.get('assistantName')?.setValue('');
    this.profileDataForm.get('assistantPhone')?.setValue('');
    this.profileDataForm.get('assistantEmail')?.reset();
    this.profileDataForm.get('description')?.reset();
    this.profileDataForm.get('otherInfo')?.reset();
    this.profileDataForm.get('linkedin')?.reset();
    this.profileDataForm.get('twitter')?.reset();
    this.profileDataForm.get('showTwitterFeed')?.setValue(false);
    this.profileDataForm.get('logonDate')?.setValue('');
  }

  saveProfile(event: any) {
    if (this.profileDataForm.invalid) {
      this.profileDataForm.markAllAsTouched();
      return;
    }

    this.profileService
      .updateProfileById(this.userId, this.profileDataForm.value)
      .subscribe(
        (data: any) => {
          if (data) {
            this.toastrService.showToastr(
              "success",
              "Profile Updated Successfully!"
            );
          }
          this.location.back();
        },
        (error) => { }
      );
    // } else {
    //   this.toastrService.showToastr(
    //     "error",
    //     "Please fill all required fields!"
    //   );
    // }
  }

  backNavigation() {
    this.route.navigate(["../../"], { relativeTo: this.activateRoute });
  }

  onClickCard(event: any) { }
}
