import { ToastrService } from './../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { AttachmentsComponent } from './attachments/attachments.component';
import { EventAttendeesComponent } from './event-attendees/event-attendees.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  @ViewChild(EventInfoComponent) infoChild!: EventInfoComponent;
  @ViewChild(EventAttendeesComponent) attendeeChild!: EventAttendeesComponent;
  @ViewChild(AttachmentsComponent) attachmentChild!: AttachmentsComponent;
  pageSelection: any;
  breadCrumb = "Information"
  eventId: any;
  attendeesSuccess: any;
  PageType: any;
  commiteeId: any;
  isPublished: any = false;
  status: any;
  currentTab: any = 'info';
  fromPage: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.pageSelection = this.activatedRoute.snapshot.queryParams.page;
    this.eventId = this.activatedRoute.snapshot.queryParams.eventId;
    this.PageType = this.activatedRoute.snapshot.queryParams.type;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
    this.status = this.activatedRoute.snapshot.queryParams.status;
    this.fromPage = this.activatedRoute.snapshot.queryParams.from;
    if (this.pageSelection == 'info') {
      this.breadCrumb = "Information"
    } else if (this.pageSelection == 'attendee') {
      this.breadCrumb = "Attendees"
    } else {
      this.breadCrumb = "Documents"
    }
  }

  navigation(type: any) {
    // console.log(this.infoChild, this.attendeeChild, this.attendeeChild);
    this.pageSelection = this.activatedRoute.snapshot.queryParams.page;
    this.eventId = this.activatedRoute.snapshot.queryParams.eventId;
    this.PageType = this.activatedRoute.snapshot.queryParams.type;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
    this.isPublished = this.activatedRoute.snapshot.queryParams.isPublished;
    this.status = this.activatedRoute.snapshot.queryParams.status;
    if (this.eventId) {
      if (type == 'info') {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/meetings/newEvent/information'], { queryParams: { page: "info", type: this.PageType, eventId: this.eventId, commiteeId: this.commiteeId, status: this.status, isPublished: this.isPublished } })
        })
      } else if (type == 'attendees') {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/meetings/newEvent/attendee'], { queryParams: { page: "attendee", type: this.PageType, eventId: this.eventId, commiteeId: this.commiteeId, status: this.status, isPublished: this.isPublished  } })
        })
      } else {
        // if (this.attachmentChild.attachmentForm.valid) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/meetings/newEvent/attachment'], { queryParams: { page: "doc", type: this.PageType, eventId: this.eventId, commiteeId: this.commiteeId, status: this.status, isPublished: this.isPublished  } })
        })
        // } else {
        //   this.toastr.showToastr('info', 'Please fill the form.');
        // }
      }
    }
    this.currentTab = type;
  }

  backNavigation() {
    if (this.fromPage == 'home') {
      this.router.navigate(["admin"]);
    } else {
      this.router.navigate(['admin/meetings'])
    }
  }

}
