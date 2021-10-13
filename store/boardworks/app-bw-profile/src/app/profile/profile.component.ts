import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'lib-bw-svc-apis/src/lib/http/http.service';
import { ProfileService } from 'lib-bw-svc-apis/src/lib/profile/profile.service';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  committeeId = new FormControl('');
  profileHeaderCardClass = 'profileHeaderCardClass';
  profilecardTitileclass = 'profilecardTitileclass';
  labelClass = 'bw-font-sec-bold'
  alphaFlag: any;
  commiteeSelect: any;
  profileUsersData: any;
  profileData: any;
  userBoards: any;
  defaultItem: any = { id: 'ede', value: "all" };
  profileImageData: any = [];
  //subscription: Subscription;
  activeClass = 0;
  defalutCommittee: any;
  userData: any;

  constructor(private profileService: ProfileService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private storageService: StorageService,

  ) { }

  ngOnInit(): void {
    this.userData = this.storageService.getData('user') && JSON.parse(this.storageService.getData('user'));
    this.getEntitiesCommittees();
    // this.getProfiles();

  };


  getProfiles() {
    this.profileService.getProfile().subscribe((data: any) => {
      this.getprofilesThumbnails(data.result);
    },
      error => {
      }
    )
  };

  getprofilesThumbnails(profileThum: any) {

    this.profileUsersData = profileThum;

    let tempArray: any = [];
    profileThum.forEach((element: any) => {
      tempArray.push(element.userId)
    });
    const reqObj = {
      UserIds: tempArray
    }
    this.profileService.getprofilesThumbnails(reqObj).subscribe((data: any) => {
      let tempArrays: any = []
      this.profileImageData = []
      profileThum.forEach((profile: any) => {
        profile.isSelected = false;
        data.result.forEach((image: any) => {
          if (profile.userId === image.userId) {
            //  tempObj = { userId: profile.userId, name: profile.name, thumbnail: image.thumbnail };
            let merge = { ...profile, ...image };
            tempArrays.push(merge);
            this.profileImageData = tempArrays;
          }
        });
      });
      //this.profileClick(0, this.profileImageData[0])
      this.profileData=this.profileImageData[0];

    })
  };



  async getEntitiesCommittees() {
    this.profileService.getEntitiesCommittees().subscribe(async (data: any) => {
      let obj = { name: 'ALL', committeeId: '1' }
      data.result.unshift(obj);
      this.userBoards = data.result;
      await this.getDefalutCommitte(data.result);
    })
  };

  alphaSerch(event: any) {
    if (event == 'ALL') {
      this.alphaFlag = '';
      //this.getProfiles();
    } else {
      this.alphaFlag = event;
    }
    if (this.alphaFlag && this.commiteeSelect) {
      this.profileService.getCommitteeLetterFilter(this.commiteeSelect, this.alphaFlag).subscribe((data: any) => {
        this.getprofilesThumbnails(data.result);
      })
    } else if (this.alphaFlag) {
      this.profileService.getletterFilter(event).subscribe((data: any) => {
        this.getprofilesThumbnails(data.result);
      });

    } else if (event === 'ALL' && this.commiteeSelect) {
      this.profileService.getCommitteeLetterFilter(this.commiteeSelect, '').subscribe((data: any) => {
        this.getprofilesThumbnails(data.result);
      })
    } else {
      this.getProfiles();
    }
  };


  changecomitee(e: any) {
    this.commiteeSelect = e;
    console.log(this.commiteeSelect, 'commiteeSelect');
    if (e == '1') {
      this.commiteeSelect = '';
      //this.getProfiles();
    } else {
      this.commiteeSelect = e;
    }
    if (this.alphaFlag && this.commiteeSelect) {
      this.profileService.getCommitteeLetterFilter(this.commiteeSelect, this.alphaFlag).subscribe(async (data: any) => {
        await this.getprofilesThumbnails(data.result);
      })
    } else if (this.commiteeSelect) {
      this.profileService.getCommitteeFilter(e).subscribe(async (data: any) => {
        await this.getprofilesThumbnails(data.result);
      })
    } else if (e == '1' && this.alphaFlag) {
      this.profileService.getletterFilter(this.alphaFlag).subscribe((data: any) => {
        this.getprofilesThumbnails(data.result);
      });
    } else {
      this.getProfiles();

    }
  };


  profileClick(index: any, event: any) {
    this.activeClass = index;
    if (event.isSelected && this.userData.userId === event.userId) {
      this.route.navigate([`view/My`], { relativeTo: this.activateRoute })

    } else if (event.isSelected) {
      this.route.navigate([`view/${event.userId}`], { relativeTo: this.activateRoute })
    };

    this.profileImageData.forEach((element: any) => {
      if (event.userId == element.userId) {
        element.isSelected = true;
      } else {
        element.isSelected = false;
      }
    });
    this.profileService.getProfileById(event && event ? event.userId : '',).subscribe((data: any) => {
      this.profileData = data.result;
    })
  }


  getDefalutCommitte(committee: any) {
    this.profileService.getdefalutCommitee().subscribe((data: any) => {
      if (data.result) {
        committee.forEach(async (element: any) => {
          if (element.name == data.result) {
            this.defalutCommittee = element;
            this.committeeId.patchValue(element.committeeId)
            await this.changecomitee(element.committeeId)
            console.log(this.committeeId, 'selectField');
          }

        });
      } else {
        committee.forEach((element: any) => {
          if (element.name == "ALL") {
            this.committeeId.patchValue(element.committeeId)

          }
        })


        this.getProfiles();
      }
    })

  };

  viewProfile(event: any, data: any) {


    if (this.userData.userId === data.userId) {
      this.route.navigate([`view/${"My"}`], { relativeTo: this.activateRoute })

    } else {
      this.route.navigate([`view/${data.userId}`], { relativeTo: this.activateRoute })
    };

    
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

