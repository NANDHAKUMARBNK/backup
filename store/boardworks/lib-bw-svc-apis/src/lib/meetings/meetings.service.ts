import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";
import { CommonService } from "../common/common.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class MeetingsService {
  constructor(
    private httpService: HttpService,
    private commonService: CommonService,
    private httpClient: HttpClient
  ) {}
  meetingListAPICall: EventEmitter<any> = new EventEmitter();
  getMeetings(data?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetings}`,
      data
    );
  }
  saveMeetingInfo(data: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetings}`,
      data
    );
  }

  meetingsAttendeesPickerCommittees(id: any, bool: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetingsAttendeesPickerCommittees}/${id}?isGroupAccess=${bool}`
    );
  }

  getMeetingAttendanceReport(requestDates: any, requestFields: any) {
    if (requestDates) {
      requestDates.StartDate = this.commonService.formatYearMonthDay(
        requestDates.StartDate
      );
      requestDates.EndDate = this.commonService.formatYearMonthDay(
        requestDates.EndDate
      );
    }
    const title: any =
      requestFields.title && requestFields.title != ""
        ? `&Title=${requestFields.title}`
        : "";
    const user_name: any =
      requestFields.userName && requestFields.userName != ""
        ? `&Username=${requestFields.userName}`
        : "";
    const committee_name: any =
      requestFields.committeeName && requestFields.committeeName != ""
        ? `&CommitteeName=${requestFields.committeeName}`
        : "";
    const status: any =
      requestFields.status && requestFields.status != ""
        ? `&Status=${requestFields.status}`
        : "";
    const attendance_type: any =
      requestFields.attendanceType && requestFields.attendanceType != ""
        ? `&AttendanceType=${requestFields.attendanceType}`
        : "";
    const first_name: any =
      requestFields.firstName && requestFields.firstName != ""
        ? `&FirstName=${requestFields.firstName}`
        : "";
    const last_name: any =
      requestFields.lastName && requestFields.lastName != ""
        ? `&LastName=${requestFields.lastName}`
        : "";
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetingAttendanceReports}?startDate=${requestDates.StartDate}&endDate=${requestDates.EndDate}${title}${user_name}${committee_name}${status}${attendance_type}${first_name}${last_name}`
    );
  }
  updateMeetingAttendance(request: any, queryParams: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${queryParams}/${apiConstant.attendance}`,
      request
    );
  }
  getExportMeetingReport(requestDates: any, requestFields: any) {
    if (requestDates) {
      requestDates.StartDate = this.commonService.formatYearMonthDay(
        requestDates.StartDate
      );
      requestDates.EndDate = this.commonService.formatYearMonthDay(
        requestDates.EndDate
      );
    }
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.exportMeetingAttendanceReport}?startDate=${requestDates.StartDate}&endDate=${requestDates.EndDate}&Title=${requestFields.title}&Username=${requestFields.userName}&Status=${requestFields.status}&CommitteeName=${requestFields.committeeName}&FirstName=${requestFields.firstName}&LastName=${requestFields.lastName}&AttendanceType=${requestFields.attendanceType}`
    );
  }
  postMeetingAndEventsExport(request: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetingExport}`,
      request
    );
  }
  getMeetingsList(data?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetingsList}`,
      data
    );
  }

  getDeflautSelection(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetingsAttendees}/${id}`
    );
  }

  saveAttendees(meetingId: any, data: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${meetingId}/Attendees`,
      data
    );
  }
  getMeetingDetails(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}`
    );
  }
  deleteMeetingById(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.meetings}/${id}`
    );
  }
  getDownloadMeetingAndAgenda(id: any, data: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.documents}/${apiConstant.unified}?${data}`
    );
  }
  getMeetingAddToCalender(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.addToCalendar}`
    );
  }
  getMeetingDetailsCopyById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.copy}`
    );
  }
  getStatusCodeFromUrl(url: any) {
    return this.httpService.get(url);
  }
  PutMeetingInfo(id: any, data: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/info`,
      data
    );
  }
  getEmailTemplateById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.emailTemplate}`
    );
  }
  postEmailSendById(id: any, req: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.emailSend}`,
      req
    );
  }
  downloadBoardBookMeetingById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.documents}/${apiConstant.boardBook}`
    );
  }

  PutAgendaDocumentUpload(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/Agenda`,
      body
    );
  }

  getAgendaDocument(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/Agenda`
    );
  }

  PutDocumentUpload(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems`,
      body
    );
  }

  getDocument(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems`
    );
  }
  deleteAgendaDcoument(id: any, itemId: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/Agenda/${itemId}`
    );
  }

  deleteAgendaItemsDcoument(id: any, itemId: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems/${itemId}`
    );
  }

  getUpcomingMeetings() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.upcomingMeetings}`
    );
  }

  addEvents(body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.events}`,
      body
    );
  }

  editDocumetAgenda(id: any, agendItemId: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems/${agendItemId}`,
      body
    );
  }

  saveDocumetAgenda(id: any,  body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems`,
      body
    );
  }

  saveEventAttendees(eventId: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${eventId}/Attendees`,
      body
    );
  }

  addEventAttachment(eventId: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${eventId}/Attachments`,
      body
    );
  }
  editDocumetAgendaDocumet(id: any, agendItemId: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems/${agendItemId}/Document`,
      body
    );
  }

  publishMeeting(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/Publish`,
      {}
    );
  }
  unPublishMeeting(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/UnPublish`,
      {}
    );
  }

  getEventDetails(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${id}`
    );
  }
  getEventAddToCalender(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${id}/${apiConstant.addToCalendar}`
    );
  }

  deleteAllDcoument(id: any, body: any) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body,
    };
    return this.httpService.deleteWithBody(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems`,
      options
    );
  }

  addDocumetAgendaDocumet(id: any, body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems/Document`,
      body
    );
  }

  getEventInfo(eventId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${eventId}/${apiConstant.info}`
    );
  }
  getEventAttendees(eventId: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${eventId}/Attendees`
    );
  }
  updateEventInfo(body: any, eventId: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${eventId}/${apiConstant.info}`,
      body
    );
  }
  getEventDetailsToCopyById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${id}/${apiConstant.copy}`
    );
  }
  getEventAttachments(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.events}/${id}/Attachments`
    );
  }
  getDiscussions(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.discussions}?meetingId=${id}`
    );
  }
  getDiscussionsByDiscussionId(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.discussions}/${id}`
    );
  }
  sendReplyByDiscussionId(id: any, req: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.discussions}/${id}/${apiConstant.reply}`,
      req
    );
  }
  unPublishEvent(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${id}/UnPublish`,
      {}
    );
  }
  publishEvent(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${id}/Publish`,
      {}
    );
  }
  archiveEvent(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${id}/${apiConstant.archived}`,
      {}
    );
  }
  unarchiveEvent(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.events}/${id}/${apiConstant.unArchived}`,
      {}
    );
  }
  creteDiscussion(data: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.discussions}`,
      data
    );
  }
  updateDiscussionById(data: any, id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.discussions}/${id}`,
      data
    );
  }

  getEditDocumentPicker(id: any, agendaItemId: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.meetings}/${id}/AgendaItems/${agendaItemId}`);
  }

  deleteDiscussionById(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.discussions}/${id}`);
  }
  archiveMeeting(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.archived}`,
      {}
    );
  }
  unarchiveMeeting(id: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.unArchived}`,
      {}
    );
  }

  getAdminUserById(id: any, noNavigate?: any) {
    let navigate = noNavigate ? `?noNavigate=true` : ''
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUsers}/${id}${navigate}`
    );
  }

  getMeetingAttendanceReportById(id: any, requestDates: any, requestFields: any) {
    if (requestDates) {
      requestDates.StartDate = this.commonService.formatYearMonthDay(
        requestDates.StartDate
      );
      requestDates.EndDate = this.commonService.formatYearMonthDay(
        requestDates.EndDate
      );
    }
    const title: any =
      requestFields.title && requestFields.title != ""
        ? `&Title=${requestFields.title}`
        : "";
    const user_name: any =
      requestFields.userName && requestFields.userName != ""
        ? `&Username=${requestFields.userName}`
        : "";
    const committee_name: any =
      requestFields.committeeName && requestFields.committeeName != ""
        ? `&CommitteeName=${requestFields.committeeName}`
        : "";
    const status: any =
      requestFields.status && requestFields.status != ""
        ? `&Status=${requestFields.status}`
        : "";
    const attendance_type: any =
      requestFields.attendanceType && requestFields.attendanceType != ""
        ? `&AttendanceType=${requestFields.attendanceType}`
        : "";
    const first_name: any =
      requestFields.firstName && requestFields.firstName != ""
        ? `&FirstName=${requestFields.firstName}`
        : "";
    const last_name: any =
      requestFields.lastName && requestFields.lastName != ""
        ? `&LastName=${requestFields.lastName}`
        : "";
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.meetings}/${id}/${apiConstant.AttendanceReports}?startDate=${requestDates.StartDate}&endDate=${requestDates.EndDate}${title}${user_name}${committee_name}${status}${attendance_type}${first_name}${last_name}`
    );
  }
}
