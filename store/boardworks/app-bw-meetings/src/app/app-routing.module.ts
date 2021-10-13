import { EventDetailsComponent } from './event-details/event-details.component';
import { EventInfoComponent } from './new-event/event-info/event-info.component';
import { AttachmentsComponent } from './new-event/attachments/attachments.component';
import { EventAttendeesComponent } from './new-event/event-attendees/event-attendees.component';
import { NewEventComponent } from './new-event/new-event.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MeetingsEventsListComponent } from "./meetings-events-list/meetings-events-list.component";
import { AttendessComponent } from "./newMeeting/attendess/attendess.component";
import { DocumentsComponent } from "./newMeeting/documents/documents.component";
import { MettingInfoComponent } from "./newMeeting/metting-info/metting-info.component";
import { NewMettingComponent } from "./newMeeting/new-metting.component";
import { AttendanceReportsComponent } from "./attendance-reports/attendance-reports.component";
import { MeetingDetailsComponent } from "./meeting-details/meeting-details.component";
import { SendMailComponent } from "./send-mail/send-mail.component";

const routes: Routes = [
  { path: "", component: MeetingsEventsListComponent },
  { path: "attendance-reports", component: AttendanceReportsComponent },
  { path: "meeting-details", component: MeetingDetailsComponent },
  { path: "send-mail", component: SendMailComponent },
  {
    path: "newMetting",
    component: NewMettingComponent,
    children: [
      {
        path: "information",
        component: MettingInfoComponent,
      },
      {
        path: "attendee",
        component: AttendessComponent,
      },
      {
        path: "document",
        component: DocumentsComponent,
      },
    ],
  },
  {
    path: "newEvent",
    component: NewEventComponent,
    children: [
      {
        path: "information",
        component: EventInfoComponent,
      },
      {
        path: "attendee",
        component: EventAttendeesComponent,
      },
      {
        path: "attachment",
        component: AttachmentsComponent,
      },
    ],
  },
  { path: "event-details", component: EventDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
