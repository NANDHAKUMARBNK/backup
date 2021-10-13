import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.css'],
})
export class VideouploadComponent implements OnInit {
  title: any;
  description: any;
  video: any;
  link: any;
  youtube: any;
  radioLink: any;
  showYoutube = false;
  showFileUpload = false;
  showYoutubeId: any;
  publicCatagoryId: any = 3;
  showFile: any;
  fileData: any;
  resForUploadFiles: any;
  resS3: string;
  videoData: any;
  videoData2: any;
  youtubeUrl: any = false;
  constructor(
    private covidTrackingService: CovidtrackingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let popup = localStorage.getItem('showpopup');
    if (popup) {
      localStorage.clear();
    }
  }
  changeTitle(e) {
    this.title = e.target.value;
  }
  changeDescription(e) {
    this.description = e.target.value;
  }
  changeVideo(e) {
    this.video = e.target.value;
    let randomName =
      'Public-' +
      Math.random().toString(36).substring(7) +
      '-' +
      new Date().getTime();
    let file = e.target.files[0];
    let mimetype = file.type;
    if (mimetype.match(/video\/*/)) {
      const name = randomName + file.name.substring(file.name.lastIndexOf('.'));
      file = new File([file], name, { type: file.type });
      this.fileData = file;
    }
  }
  changeLinkRadio(e) {
    this.radioLink = e.target.value;
    let Id = e.target.id;
    if (Id === 'youtube') {
      this.showYoutubeId = Id;
      this.showYoutube = true;
      this.showFileUpload = false;
    } else {
      this.showFileUpload = true;
      this.showYoutube = false;
    }
  }
  changeUploadRadio(e) {
    this.link = e.target.value;
    let Id = e.target.id;
    if (Id === 'upload') {
      this.showFileUpload = true;
      this.showYoutube = false;
      this.showFile = Id;
      this.title = '';
      this.description = '';
      this.youtube = '';
    } else {
      this.showYoutube = true;
      this.showFileUpload = false;
    }
  }

  changeYoutube(e) {
    this.youtube = e.target.value;
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (this.youtube.match(p)) {
      this.youtubeUrl = true;
      return this.youtube.match(p)[1];
    }
    this.youtubeUrl = false;
    return false;
  }

  noInterest() {
    this.router.navigate(['']);
  }
  upload() {
    window.scroll(0, 0);
    if (this.showFileUpload && !this.showYoutube && this.fileData) {
      const reqForUploadFile = {
        filename: this.fileData.name,
      };
      this.covidTrackingService.uploadFile(reqForUploadFile).subscribe(
        (response: any) => {
          this.resForUploadFiles = response.url;
          const formData = new FormData();
          formData.append('File', this.fileData);
          this.covidTrackingService
            .toS3Api(this.resForUploadFiles, this.fileData)
            .subscribe((res: any) => {
              const urlNew = `https://siddha-tracker-prod.s3.ap-south-1.amazonaws.com/`;
              this.resS3 = urlNew + this.fileData.name;
              if (res) {
                const reqVideoManagement = {
                  category_id: this.publicCatagoryId,
                  title: this.title,
                  description: this.description,
                  attachment: this.resS3,
                  link: this.youtube,
                  sort_order: 1,
                };
                if (
                  reqVideoManagement.title === undefined ||
                  reqVideoManagement.link === undefined ||
                  reqVideoManagement.description === undefined ||
                  reqVideoManagement.attachment === undefined
                ) {
                  return;
                } else {
                  this.covidTrackingService
                    .saveVideoManagement(reqVideoManagement)
                    .subscribe((response: any) => {
                      this.videoData = response.result;
                      if (this.videoData) {
                        let Success = this.toastr.success(
                          'Successfully Uploaded'
                        );
                        if (Success) {
                          this.router.navigate(['']);
                        }
                      }
                    });
                }
              }
            });
        },
        (error) => {
          this.toastr.error('Something Went Wrong');
          console.log(error);
        }
      );
    } else {
      const request = {
        category_id: this.publicCatagoryId,
        title: this.title,
        description: this.description,
        attachment: '',
        link: this.youtube,
        sort_order: 1,
      };
      if (request.title === undefined || request.link === undefined) {
        return;
      } else {
        if (request.description === undefined) {
          request.description = '';
        }
        if (request.title && request.link) {
          if (this.youtubeUrl === false) {
            return;
            // this.toastr.warning('Please Provide Youtube Link Correctly');
          } else {
            this.covidTrackingService.saveVideoManagement(request).subscribe(
              (response: any) => {
                this.videoData2 = response.result;
                if (this.videoData2) {
                  this.router.navigate(['/success']);
                }
              },
              (error) => {
                this.toastr.error('Something Went Wrong');
                console.log(error);
              }
            );
          }
        }
      }
    }
  }
}
