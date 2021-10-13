import { IExportColumnHeaders } from "./IExport";
export class ExportColumnHeaders {
  public static get GridColumns(): Array<IExportColumnHeaders> {
    return [
      {
        field: "title",
        title: "Title",
      },
      {
        field: "type",
        title: "Type",
      },
      {
        field: "startDateTime",
        title: "Date",
      },
      {
        field: "committeeName",
        title: "Committee",
      },
      {
        field: "status",
        title: "Status",
      },
      // {
      //   field: "action",
      //   title: "ACTIONS",
      // },
    ];
  }
  public static get AttendanceReportGridColumns(): Array<IExportColumnHeaders> {
    return [
      {
        field: "title",
        title: "Meeting or Event",
      },
      {
        field: "meetingDate",
        title: "Meeting Date",
      },
      {
        field: "committeeName",
        title: "Committee",
      },
      {
        field: "userName",
        title: "Username",
      },
      {
        field: "firstName",
        title: "First Name",
      },
      {
        field: "lastName",
        title: "Last Name",
      },
      {
        field: "status",
        title: "STATUS",
      },
      {
        field: "attendanceType",
        title: "Attendance Type",
      },
      {
        field: "comment",
        title: "Comment",
      },
    ];
  }
}
