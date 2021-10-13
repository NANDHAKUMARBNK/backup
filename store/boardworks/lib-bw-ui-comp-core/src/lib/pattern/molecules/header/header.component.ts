import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { HttpService } from "lib-bw-svc-apis/src/lib/http/http.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";
import { ProfileService } from "lib-bw-svc-apis/src/lib/profile/profile.service";
import { ROLES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";

@Component({
  selector: "bw-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Output() clickAvatar: any = new EventEmitter<any>();
  isShowToggle: boolean = false;
  userDetails: any;
  imageUrl: any = "assets/images/userprofile.png";
  menuUrl: any = "assets/images/gridpurple.png";
  image: any;
  isShowQuickAdd: boolean = false;
  permissions: any;
  role: any;
  userPermission: any;
  isShowButton: boolean = true;
  isShowOptions: boolean = true;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private storage: StorageService,
    private http: HttpService,
    private httpClient: HttpClient,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService
  ) {
    this.permissions = JSON.parse(window.sessionStorage["pagePermission"]);
    this.role = JSON.parse(window.sessionStorage["roles_data"]);
    if (
      this.role.type == ROLES.directors ||
      this.role.type == ROLES.auditors ||
      this.role.type == ROLES.regulators ||
      this.role.type == ROLES.officers ||
      this.role.type == ROLES.seniorOfficers ||
      this.role.type == ROLES.siteViewers
    ) {
      this.isShowButton = false;
    } else if (this.role.type == ROLES.committeeAdmins) {
      this.isShowOptions = false;
    } else {
      this.isShowButton = true;
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.profileService.updateApiCallProfilePicture.subscribe((data: any) => {
      if (data) {
        this.getUser();
      }
    });
  }
  aboutUser: any = {
    supportTitle: "BOARD SUPPORT",
    assistTitile: "24/7 SUPPORT FROM CGS",

    userOptions: [
      {
        content: "Your Profile",
        url: "profile",
      },
      {
        content: "Change Password",
        url: "admin/change-password",
      },
      {
        content: "Change Security Questions",
        url: "admin/security-questions",
      },
    ],
    support: [
      {
        location: "North America",
        contact: "1.555.555.5555",
      },
      {
        location: "Worldwide",
        contact: "555.555.5555",
      },
    ],
    assist: [
      {
        contact: "cgsglobalsupport@computershare.com",
        url: "",
      },
    ],
  };
  getUser() {
    this.commonService.getMyProfile().subscribe((response: any) => {
      if (response.result) {
        this.userDetails = response.result;
        window.sessionStorage.setItem("userId", response.result.userId);
        let token = this.storageService.getData("userToken");
        const headers = new HttpHeaders().set(
          "Authorization",
          "Bearer" + token
        );
        this.httpClient
          .get(`${environment.baseUrl}${apiConstant.profile}/My/Image/large`, {
            headers,
            responseType: "arraybuffer",
          })
          .subscribe((data: ArrayBuffer) => {
            try {
              const binArray = new Uint8Array(data);
              const fileBlob = new Blob([binArray], { type: "image/jpeg" });
              this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
                window.URL.createObjectURL(fileBlob)
              );
              console.log("this.image", this.image);
            } catch (error) {}
          });
      }
    });
  }
  clickToggle(e: any) {
    this.isShowToggle = !this.isShowToggle;
    this.isShowQuickAdd = false;
  }
  clickUserOptions(e: any) {
    this.isShowToggle = false;
    if (e.url === "profile") {
      // let navigationExtras: NavigationExtras = { state: this.userDetails };
      // this.router.navigate([`admin/${e.url}/view/${this.userDetails.userId}/oProfile`]);

      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([`admin/${e.url}/view/My`]);
      });
    } else if (e.url === "admin/change-password") {
      this.router.navigate([`${e.url}`]);
    } else if (e.url === "admin/security-questions") {
      this.router.navigate([`${e.url}`]);
    } else {
      return;
    }
  }
  async logout(e: any) {
    this.storage.removeAllData();
    const token = await this.http.tokenAuthCheckAndGetToken("app");
    if (token) {
      this.router.navigate(["/login"]);
      // console.log(token);
    }
  }
  clickImg(e: any) {
    this.clickAvatar.emit(e);
  }
  quickAdd() {
    this.isShowQuickAdd = !this.isShowQuickAdd;
    this.isShowToggle = false;
  }
  actionClick(type: any) {
    if (type === "alert") {
      this.router.navigate(["admin/alerts/new-alert"]);
    } else if (type === "evaluation") {
      this.router.navigate(["admin/evaluations/newEvaluation"]);
    } else if (type === "event") {
      this.router.navigate(
        [`admin/meetings/newEvent/information?page=info`.split("?")[0]],
        {
          queryParams: { page: "info" },
        }
      );
    } else if (type === "meeting") {
      this.router.navigate(
        [`admin/meetings/newMetting/information?page=info`.split("?")[0]],
        {
          queryParams: { page: "info" },
        }
      );
    } else if (type === "survey") {
      this.router.navigate(["admin/surveys/newSurvey"]);
    } else if (type === "vote") {
      this.router.navigate(["admin/votings/create-vote"]);
    } else if (type === "link") {
      this.router.navigate(["admin/links/createLink/LINK"]);
    } else if (type === "collaboration") {
      this.router.navigate(["admin/collaborations/addWorkSpace"]);
    } else if (type === "profile") {
      this.router.navigate(["admin/profile"]);
    } else if (type === "document") {
      this.router.navigate([
        "admin/documents/newFolder",
        {
          type: "create",
          level: "CorporateInfo",
        },
      ]);
    } else {
    }
    this.isShowQuickAdd = false;
  }
}
