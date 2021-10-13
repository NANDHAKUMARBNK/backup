import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";
import { StorageService } from "../storage/storage.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  recent_updates: any;
  sidenavItems: any;
  constructor(
    private httpService: HttpService,
    private storage: StorageService
  ) {}

  getMyProfile() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.myProfile}`
    );
  }

  documentcache(formData: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.documentsCache}`,
      formData
    );
  }

  formatDate(selectedDate?: any, component?: any) {
    let monthShortNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let weeks: any = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(selectedDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const weekday: any = date.getDay();
    const time: any = this.getTime(date);
    const formattedDate = monthShortNames[month] + " " + day + ", " + year;
    const formatDateWithWeekAndTime =
      weeks[weekday] + ", " + formattedDate + "-" + time;
    if (component === "meetingDetails") {
      return formatDateWithWeekAndTime;
    } else if (component === "withTime") {
      return formattedDate + " " + time;
    } else if (component == "dateWithPipeTime") {
      return `${formattedDate} | ${time}`;
    } else {
      return formattedDate;
    }
  }
  getTime(date?: any, type?: any) {
    date = new Date(date);
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime: any =
      type === "without"
        ? hours + ":" + minutes
        : hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  entitiesCommittees() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.entitiesCommittees}`
    );
  }
  timezones() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.settings}/${apiConstant.timezones}`
    );
  }
  join(t: any, a: any, s: any) {
    function format(m: any) {
      let f = new Intl.DateTimeFormat("en", m);
      return f.format(t);
    }
    return a.map(format).join(s);
  }
  formatYearMonthDay(req: any) {
    req = new Date(req);
    let a = [{ year: "numeric" }, { month: "numeric" }, { day: "numeric" }];
    let s = this.join(req, a, "-");
    return s;
  }
  calculateDatesDuration(startDate: any, endDate: any) {
    const startDay = new Date(startDate).getTime();
    const endDay = new Date(endDate).getTime();
    const diff = endDay - startDay;
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    console.log(diffDays);
    return diffDays;
  }

  getentitiesCommitteesOfficerGroups() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.entitiesCommitteesOfficerGroups}?withUsers=true`
    );
  }

  getentitiesCommittees() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.entitiesCommitteesOfficerGroups}?withUsers=false`
    );
  }
  getEntitiesAppotiment() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.appointments}`
    );
  }

  deleteDocumentcache(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.documentsCache}?referenceIds=${id}`
    );
  }
  setRecentUpdates(data: any) {
    data.map((item: any) => {
      if (
        item.entity.toLowerCase() === "surveys" ||
        item.entity.toLowerCase() === "votings" ||
        item.entity.toLowerCase() === "evaluations"
      ) {
        item.moduleName = `The ${item.entity.toLowerCase()} :`;
        item.bodyName = item.name;
        item.text = `is closing on ${this.formatDate(item.closingDate)}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "collaborations" &&
        item.itemType.toLowerCase() === "entity"
      ) {
        item.moduleName = `The ${item.entity.toLowerCase()} workspace :`;
        item.bodyName = item.workspace;
        item.text = !item.modifiedDate
          ? `was created on ${this.formatDate(item.createdDate)}`
          : `was modified on ${this.formatDate(item.modifiedDate)}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "collaborations" &&
        item.itemType.toLowerCase() === "document"
      ) {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (item.entity.toLowerCase() === "collaborationdocuments") {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "references" &&
        item.itemType.toLowerCase() === "entity"
      ) {
        item.moduleName = `The ${item.entity.toLowerCase()} workspace :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created on ${this.formatDate(item.createdDate)}`
          : `was modified on ${this.formatDate(item.modifiedDate)}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "references" &&
        item.itemType.toLowerCase() === "document"
      ) {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (item.entity.toLowerCase() === "referencesdocuments") {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "references" &&
        item.itemType.toLowerCase() === "referencetask"
      ) {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle
          ? item.documentTitle
          : item.documentFilename;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (item.entity.toLowerCase() === "discussions") {
        item.moduleName = `The ${item.entity} :`;
        item.bodyName = item.subject;
        item.text = !item.parentDiscussionId
          ? `started on ${this.formatDate(item.modifiedDate)}`
          : `was updated on ${this.formatDate(item.modifiedDate)}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "alerts" &&
        item.itemType.toLowerCase() === "entity"
      ) {
        item.moduleName = `The ${item.entity.toLowerCase()} :`;
        item.bodyName = item.title;
        item.text = !item.modifiedDate
          ? `was posted on ${this.formatDate(item.createdDate)}`
          : `was posted on ${this.formatDate(item.modifiedDate)}.`;
        item.showFlag = true;
      } else if (
        item.entity.toLowerCase() === "alerts" &&
        item.itemType.toLowerCase() === "document"
      ) {
        item.moduleName = `The file :`;
        item.bodyName = item.alertTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      }
      //
      else if (item.entity.toLowerCase() === "alertdocuments") {
        item.moduleName = `The file :`;
        item.bodyName = item.documentTitle;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      } else if (item.entity.toLowerCase() === "meetingsevents") {
        item.moduleName = `The ${item.entity} :`;
        item.bodyName = item.title;
        item.text = !item.modifiedDate
          ? `was created in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.createdDate
            )}`
          : `was posted in ${item.entity.toLowerCase()} on ${this.formatDate(
              item.modifiedDate
            )}.`;
        item.showFlag = true;
      }
    });
    this.recent_updates = data;
  }
  getRecentUpdates() {
    return this.recent_updates;
  }

  defaultTimeZone() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.settings}/${apiConstant.DefaultTimeZone}`
    );
  }
  setPermissionNavItems(params: any) {
    this.sidenavItems = params;
  }
  getPermissionNavItems() {
    return this.sidenavItems;
  }
  setRecentUpdatePermission(params: any) {
    // let info: any = this.sidenavItems.find(
    //   (it: any) => it.component && it.component.toLowerCase() === params
    // );
    let info: any = this.sidenavItems.find((it: any) =>
      it.name.toLowerCase() === "documents"
        ? "References".toLowerCase() === params
        : it.component && it.component.toLowerCase() === params
    );
    this.storage.setData("rolePermission", JSON.stringify(info));
    var permissionRequired: any;
    var loginDetails: any;
    permissionRequired = Object.values(info.permission[info.component]);
    if (info.component === "UserAdministration" && permissionRequired) {
      if (info.permission["CommitteeAdministration"]) {
        permissionRequired = [
          ...permissionRequired,
          ...info.permission["CommitteeAdministration"],
        ];
      }
      if (info.permission["OfficerGroupAdministration"]) {
        permissionRequired = [
          ...permissionRequired,
          ...info.permission["OfficerGroupAdministration"],
        ];
      }
    }
    loginDetails = {
      userInfo: info,
      userResponsibility: permissionRequired,
    };
    this.storage.setData(
      "userPermission",
      JSON.stringify(loginDetails.userResponsibility)
    );
  }
}
