import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase } from "@progress/kendo-angular-dialog";
import { HomeService } from "lib-bw-svc-apis/src/lib/home/home.service";

@Component({
  selector: "bw-settings-recent-updates",
  templateUrl: "./settings-recent-updates.component.html",
  styleUrls: ["./settings-recent-updates.component.scss"],
})
export class SettingsRecentUpdatesComponent
  extends DialogContentBase
  implements OnInit
{
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() headerTitle: any = "Recent Updates Settings";
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter();
  @Input() modalClass: any;
  labelClass: any;
  public actionsLayout = "normal";
  cardData: any;
  columnsData: any = [
    {
      title: "UPDATE",
      field: "module",
      filterType: "text",
      isEnableColumnOptions: false,
      width: 50,
    },
    {
      title: "FOLLOW",
      filterType: "text",
      isEnableColumnOptions: false,
      settingComponent: "follow",
      width: 50,
    },
    {
      title: "FLAG AS IMPORTANT",
      filterType: "text",
      isEnableColumnOptions: false,
      settingComponent: "flagImportant",
      width: 50,
    },
  ];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any = [];
  constructor(public dialog: DialogRef, private home_service: HomeService) {
    super(dialog);
  }
  ngOnInit(): void {
    this.listOfSettings();
  }
  public listOfSettings(): void {
    this.home_service.getRecentUpdatesSettings().subscribe((response: any) => {
      const { result }: any = response;
      if (result) {
        const {
          alertFollow,
          alertImportant,
          collaborationFollow,
          collaborationImportant,
          discussionsFollow,
          discussionsImportant,
          referencesFollow,
          referencesImportant,
          surveysFollow,
          surveysImportant,
          votingFollow,
          votingImportant,
          meetingAndEventsFollow,
          meetingAndEventsImportant,
          evaluationFollow,
          evaluationImportant,
        }: any = result;
        this.gridData = [
          {
            module: "Alerts",
            follow: alertFollow,
            flagImportant: alertImportant,
          },
          {
            module: "Collaboration",
            follow: collaborationFollow,
            flagImportant: collaborationImportant,
          },
          {
            module: "Discussions",
            follow: discussionsFollow,
            flagImportant: discussionsImportant,
          },
          {
            module: "References",
            follow: referencesFollow,
            flagImportant: referencesImportant,
          },
          {
            module: "Surveys",
            follow: surveysFollow,
            flagImportant: surveysImportant,
          },
          {
            module: "Votings",
            follow: votingFollow,
            flagImportant: votingImportant,
          },
          {
            module: "Meeting & Events",
            follow: meetingAndEventsFollow,
            flagImportant: meetingAndEventsImportant,
          },
          {
            module: "Evaluations",
            follow: evaluationFollow,
            flagImportant: evaluationImportant,
          },
        ];
      }
    });
  }
  public onAction(e: any): void {
    if (e === "yes") {
      const request: any = {
        setting: {
          alertFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "alerts" && item.follow
            ).length > 0
              ? true
              : false,
          alertImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "alerts" && item.flagImportant
            ).length > 0
              ? true
              : false,
          collaborationFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "collaboration" && item.follow
            ).length > 0
              ? true
              : false,
          collaborationImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "collaboration" &&
                item.flagImportant
            ).length > 0
              ? true
              : false,
          discussionsFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "discussions" && item.follow
            ).length > 0
              ? true
              : false,
          discussionsImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "discussions" &&
                item.flagImportant
            ).length > 0
              ? true
              : false,
          referencesFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "references" && item.follow
            ).length > 0
              ? true
              : false,
          referencesImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "references" && item.flagImportant
            ).length > 0
              ? true
              : false,
          surveysFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "surveys" && item.follow
            ).length > 0
              ? true
              : false,
          surveysImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "surveys" && item.flagImportant
            ).length > 0
              ? true
              : false,
          votingFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "votings" && item.follow
            ).length > 0
              ? true
              : false,
          votingImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "votings" && item.flagImportant
            ).length > 0
              ? true
              : false,
          meetingAndEventsFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "meeting & events" && item.follow
            ).length > 0
              ? true
              : false,
          meetingAndEventsImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "meeting & events" &&
                item.flagImportant
            ).length > 0
              ? true
              : false,
          evaluationFollow:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "evaluations" && item.follow
            ).length > 0
              ? true
              : false,
          evaluationImportant:
            this.gridData.filter(
              (item: any) =>
                item.module.toLowerCase() === "evaluations" &&
                item.flagImportant
            ).length > 0
              ? true
              : false,
        },
      };
      this.home_service
        .putRecentUpdatesSettings(request)
        .subscribe((response: any) => {
          if (response.result) {
            this.home_service.recentUpdatesLoad.emit(true);
            this.onCancelClick.emit("close");
          }
        });
    } else {
      this.onCancelClick.emit("close");
    }
  }
  public followClick(e: any): void {
    if (e.event.target.checked) {
      e.selected.follow = true;
    } else {
      e.selected.follow = false;
    }
  }
  public flagImportantClick(e: any): void {
    if (e.event.target.checked) {
      e.selected.flagImportant = true;
    } else {
      e.selected.flagImportant = false;
    }
  }
}
