import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/public-api";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MeetingsEventsListComponent } from "./meetings-events-list/meetings-events-list.component";
import { MeetingsEventCalendarViewComponent } from "./meetings-event-calendar-view/meetings-event-calendar-view.component";
import { NewMettingComponent } from "./newMeeting/new-metting.component";
import { MettingInfoComponent } from "./newMeeting/metting-info/metting-info.component";
import { AttendessComponent } from "./newMeeting/attendess/attendess.component";
import { DocumentsComponent } from "./newMeeting/documents/documents.component";
import { AttendanceReportsComponent } from "./attendance-reports/attendance-reports.component";
import { MeetingDetailsComponent } from "./meeting-details/meeting-details.component";
import { SendMailComponent } from './send-mail/send-mail.component';
import { CreateCollabortionComponent } from './newMeeting/documents/create-collabortion/create-collabortion.component';
import { CollaborationAllComponent } from './newMeeting/documents/collaboration-all/collaboration-all.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EventInfoComponent } from "./new-event/event-info/event-info.component";
import { EventAttendeesComponent } from "./new-event/event-attendees/event-attendees.component";
import { AttachmentsComponent } from "./new-event/attachments/attachments.component";
import { EditDcoumentComponent } from './newMeeting/documents/edit-dcoument/edit-dcoument.component';
import { AddDocumentComponent } from './newMeeting/documents/add-document/add-document.component';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetingsEventsListComponent,
    MeetingsEventCalendarViewComponent,
    AttendanceReportsComponent,
    MeetingDetailsComponent,
    NewMettingComponent,
    MettingInfoComponent,
    AttendessComponent,
    DocumentsComponent,
    SendMailComponent,
    CreateCollabortionComponent,
    CollaborationAllComponent,
    NewEventComponent,
    EventInfoComponent,
    EventAttendeesComponent,
    AttachmentsComponent,
    EditDcoumentComponent,
    AddDocumentComponent,
    EventDetailsComponent,
  ],
  imports: [CommonModule, AppRoutingModule, LibBwUiCompCoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
