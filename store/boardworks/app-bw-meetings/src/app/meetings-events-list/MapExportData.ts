export class MapExportData {
  static mapItems(item: any) {
    let csvRow: any = {};
    csvRow.title = item.title;
    csvRow.type = item.type;
    csvRow.startDateTime = item.startDateTime;
    csvRow.committeeName = item.committeeName;
    csvRow.status = item.status;
    // csvRow.action = item.action;
    return csvRow;
  }
  // Attendance Report
  static mapItemsAttendanceReport(item: any) {
    let csvRowAttendance: any = {};
    csvRowAttendance.title = item.title;
    csvRowAttendance.meetingDate = item.meetingDate;
    csvRowAttendance.userName = item.userName;
    csvRowAttendance.committeeName = item.committeeName;
    csvRowAttendance.status = item.status;
    csvRowAttendance.firstName = item.firstName;
    csvRowAttendance.lastName = item.lastName;
    csvRowAttendance.attendanceType = item.attendanceType;
    csvRowAttendance.comment = item.comment;
    return csvRowAttendance;
  }
}
