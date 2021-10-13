import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingsService } from 'lib-bw-svc-apis/src/lib/meetings/meetings.service';

@Component({
  selector: 'app-new-metting',
  templateUrl: './new-metting.component.html',
  styleUrls: ['./new-metting.component.scss']
})
export class NewMettingComponent implements OnInit {
  pageSelection: any;
  breadCrumb = "Information"
  meetingId: any;
  attendesSucess: any;
  Pagetype: any;
  commiteeId: any;
  isShowToggleAction: boolean = false;
  meetingData: any;
  isArchived: boolean = false;
  isPublished: boolean = false;
  isUnArchived: boolean = false;
  isUnPublished: boolean = false;
  fromPage: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingService: MeetingsService
  ) { }

  ngOnInit(): void {
    this.pageSelection = this.activatedRoute.snapshot.queryParams.page;
    this.meetingId = this.activatedRoute.snapshot.queryParams.meetingId;
    this.Pagetype = this.activatedRoute.snapshot.queryParams.type;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
    this.fromPage = this.activatedRoute.snapshot.queryParams.from;
    console.log(this.fromPage, 'pageeee');
    if (this.pageSelection == 'info') {
      this.breadCrumb = "Information"

    } else if (this.pageSelection == 'attendee') {
      this.breadCrumb = "Attendees"
    } else {
      this.breadCrumb = "Documents"
    }
    if (this.meetingId) {
      this.getMeetingDetailsForEditById()
    }

  }

  getMeetingDetailsForEditById() {
    this.meetingService.getMeetingDetails(this.meetingId).subscribe((response: any) => {
      this.meetingData = response.result.meetingEventItem;
      if (this.meetingData.isArchived) {
        this.isUnArchived = true;
        this.isArchived = false;
        this.isUnPublished = false;
        this.isPublished = false;


      } else if (this.meetingData.isPublished) {
        this.isArchived = true;
        this.isPublished = false;
        this.isUnPublished = true;
        this.isUnArchived = false;



      } else if (!this.meetingData.isPublished) {
        this.isArchived = false;
        this.isPublished = true;
        this.isUnPublished = false;
        this.isUnArchived = false;
      }
    })
  }



  naviagtion(type: any) {
    if (this.meetingId) {
      if (type == 'info') {
        if (this.Pagetype == "edit" || this.Pagetype == 'copy') {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['admin/meetings/newMetting/information'], { queryParams: { page: "info", type: this.Pagetype, meetingId: this.meetingId } })
          })
        } else {
          // if (this.Pagetype == "edit") {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['admin/meetings/newMetting/information'], { queryParams: { page: "info", type: this.Pagetype, meetingId: this.meetingId, commiteeId: this.commiteeId } })
          })
          // }
        }
      } else if (type == 'attendes') {
        if (this.Pagetype == "edit" || this.Pagetype == 'copy') {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['admin/meetings/newMetting/attendee'], { queryParams: { page: "attendee", type: this.Pagetype, meetingId: this.meetingId, commiteeId: this.commiteeId } })
          })
        } else {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['admin/meetings/newMetting/attendee'], { queryParams: { page: "attendee", type: this.Pagetype, meetingId: this.meetingId, commiteeId: this.commiteeId } })
          })
        }

      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

          this.router.navigate(['admin/meetings/newMetting/document'], { queryParams: { page: "doc", type: this.Pagetype, meetingId: this.meetingId, commiteeId: this.commiteeId } })
        })
      }
    }
  }

  backNavigation() {
    if (this.fromPage == 'home') {
      this.router.navigate(["admin"]);
    } else {
      this.router.navigate(['admin/meetings'])
    }
  }

  action(e: any) {
    this.isShowToggleAction = !this.isShowToggleAction;

  }

  clickActions(e: any) {
    console.log(e, 'e');
    this.isShowToggleAction = !this.isShowToggleAction;

    if (e === "Archive") {
      this.meetingService.archiveMeeting(this.meetingId).subscribe((response: any) => {
        this.getMeetingDetailsForEditById();
        window.location.reload();
      })
    } else if (e === "UnArchive") {
      this.meetingService.unarchiveEvent(this.meetingId).subscribe((response: any) => {
        this.getMeetingDetailsForEditById()
        window.location.reload();

      })
    } else if (e === "UnPublish") {
      this.meetingService.unPublishMeeting(this.meetingId).subscribe((response: any) => {
        this.getMeetingDetailsForEditById()
        window.location.reload();

      })
    } else if (e === "Publish") {
      this.meetingService.publishMeeting(this.meetingId).subscribe((response: any) => {
        this.getMeetingDetailsForEditById()
        window.location.reload();

      })
    }
  }


}
