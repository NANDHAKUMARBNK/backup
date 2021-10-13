import { ProfileService } from "./../../../../lib-bw-svc-apis/src/lib/profile/profile.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "environments/environment";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"],
})
export class ViewProfileComponent implements OnInit {
  ProfileDataForm: FormGroup;
  isCommitteeGrid: boolean = true;
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  onCellClicked: any = [];
  cardData = [
    {
      showText: true,
      title: "MY COMMITTEES",
      body: []
    }
  ];
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
      title: "MY COMMITTEES",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
  ];
  gridData: any = [];
  defaultItems: any = [
    {
      text: "Profiles",
      title: "Profiles",
    },
  ];
  userData: any;
  image: any;
  editProfileIcon: boolean = false;
  profilePage: any;
  roleData: any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private profileService: ProfileService,
    private http: HttpClient,
    private storageService: StorageService,
    private sanitizer: DomSanitizer
  ) {
    // let navigation: any = this.route.getCurrentNavigation();
    // let state: any = navigation.extras.state ? navigation.extras.state : {};
    // if (state) this.userProfileDetails = state;
    this.userId = this.activateRoute.snapshot.params.id;
    this.profilePage = this.activateRoute.snapshot.params.page;
    console.log(this.activateRoute.snapshot.params,'profilePage');
    

    this.ProfileDataForm = this.fb.group({
      userId: [""],
      id: [""],
      name: [""],
      status: [''],
      bio: [""],
      companyTitle: [""],
      company: [""],
      email: [""],
      mobilePhone: [""],
      workPhone: [""],
      country: [""],
      timeZone: [""],
      description: [""],
      imageSrc: [""],
      username: [''],
      assistantName: ["",],
      assistantPhone: [""],
      assistantEmail: [],
      otherInfo: ["",],
      linkedin: ["",],
      twitter: ["",],
      appointment: [""], // {value:'', disabled: true}

    });
  }

  ngOnInit(): void {


    const pagePermission = this.storageService.getData('pagePermission') && JSON.parse(this.storageService.getData('pagePermission'));
    if (pagePermission.Profiles) {
      let checkUser = pagePermission.Profiles.filter((item: any) => (this.userId=="My" && item.action === "ViewEditOwnProfile" && item.permission === "AllowPrivate") || (this.userId && item.action === "EditOtherProfiles" && item.permission === "Allow"))       
      if (checkUser.length > 0) {
        this.editProfileIcon = true;
      } else {
        this.editProfileIcon = false;

      }


    };




      this.getUserData(this.userId);
      this.getProfileImageById();
  

  }



  getProfileImageById() {
    let token = this.storageService.getData('userToken')
    const headers = new HttpHeaders().set('Authorization', 'Bearer' + token)


    this.http.get(`${environment.baseUrl}${apiConstant.profile}/${this.userId}/Image/large`, { headers, responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        try {
          const binArray = new Uint8Array(data);
          const fileBlob = new Blob([binArray], { type: 'image/jpeg' })
          console.log(this.image, 'imagesss');
          this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
            window.URL.createObjectURL(fileBlob)
          );


        }
        catch (error) {

        }
      })

  }

  getUserData(id: any) {
    /// API Integration
    this.profileService.getProfileById(id).subscribe(
      (data: any) => {
        this.userData = data;
        if (data) {
          this.ProfileDataForm.patchValue(data.result);
          if (data.result.commitees && data.result.commitees.length) {
            let tempArr: any = [];
            data.result.commitees.map((item: any) => {
              tempArr.push({
                id: item.committeeId,
                bodyName: item.name,
              });
            });

            this.cardData[0].body = tempArr;
          }
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

  onclick(e: any) {
    if(this.userId == "My"){
      this.route.navigate([`admin/profile/edit/My`]);

    }else {
      this.route.navigate([`admin/profile/edit/${this.userId}`]);

    }
  }
  navigateInto(params: any) {
    if (params.text === "Profiles" || params.title === "Profiles") {
      this.route.navigate([`admin/profile/view/${this.userId}`]);
    }
  }

  backNavigation() {
    this.route.navigate(['admin/profile'])

  }

  onClickCard(event: any) {

  }

  mailLink(event: any) {
    console.log(event, 'event');
    window.location.href = `mailto:${event}`
    // window.open(
    //   `mailto:${event}`,
    //   '_blank' // <- This is what makes it open in a new window.
    // )
  }
}
