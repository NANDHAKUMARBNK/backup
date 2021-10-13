import { UnpublishedListComponent } from "./../unpublished-list/unpublished-list.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { PublishedListComponent } from "../published-list/published-list.component";
import { TemplatesListComponent } from "../templates-list/templates-list.component";

@Component({
  selector: "app-alerts-home",
  templateUrl: "./alerts-home.component.html",
  styleUrls: ["./alerts-home.component.scss"],
})
export class AlertsHomeComponent implements OnInit {
  defaultItems: any = [];
  @ViewChild(UnpublishedListComponent)
  unpublished!: UnpublishedListComponent;
  @ViewChild(PublishedListComponent)
  published!: PublishedListComponent;
  @ViewChild(TemplatesListComponent)
  templates!: TemplatesListComponent;
  tabsData: any = [];
  publishedTabData = {
    title: "PUBLISHED",
    content: "",
    isSelected: true,
    isDisabled: true,
  };
  unPublishedTabData = {
    title: "UNPUBLISHED",
    content: "This is unpublished Tab",
    isSelected: false,
    isDisabled: false,
  };
  templateTabData = {
    title: "TEMPLATES",
    content: "This is templates Tab",
    isSelected: false,
    isDisabled: false,
  };
  buttonProperties: any = [
    {
      buttonText: "NEW ALERT TEMPLATE",
      className:
        "btn-base btn-contained secondary-btn-outlined btn-lg bw-font-sec-bold m-2",
      buttonAction: "template",
      isDisable: false,
      withIcon: false,
      showButton: true,
      btnCol: "7",
    },
    {
      buttonText: "NEW ALERT",
      className:
        "btn-base btn-contained secondary-btn-contained btn-lg bw-font-sec-bold me-md-4 m-2",
      buttonAction: "alert",
      isDisable: false,
      withIcon: false,
      showButton: true,
      btnCol: "5",
    },
  ];
  tab: any = "PUBLISHED";
  isShowAddAlert: boolean = false;
  isShowAddTemplate: boolean = false;
  isShowArchiveAlerts: boolean = false;
  isShowViewAlert: boolean = false;
  userPermission: any;
  isToggle: boolean = false;
  archiveToggle: boolean = false;
  toggleLabel: any = "Hide Archived Alerts";
  isDirectorLogin: boolean = false;
  userRole: any;
  mode: any;
  constructor(
    private router: Router,
    private storage: StorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.tabsData.push(this.publishedTabData);
  }

  ngOnInit(): void {
    this.userPermission = JSON.parse(this.storage.getData("userPermission"));
    this.userRole = JSON.parse(this.storage.getData("roles_data"));
    console.log("working");
    if (this.userRole.type !== "Directors") {
      this.tabsData.push(this.unPublishedTabData);
      this.tabsData.push(this.templateTabData);
    }
    this.userPermission &&
      this.userPermission.forEach((element: any) => {
        if (
          element.action == "AddAlert" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowAddAlert = true;
        }
        if (
          element.action == "AddTemplate" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowAddTemplate = true;
        }
        //DisplayArchivedAlerts
        if (
          element.action == "DisplayArchivedAlerts" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowArchiveAlerts = true;
        }
        //ViewAlert
        if (
          element.action == "ViewAlert" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.isShowViewAlert = true;
        }
      });
    this.mode = this.activatedRoute.snapshot.params.module;
    if (this.mode && this.mode.toLowerCase() === "alerts") {
      this.defaultItems = [
        {
          text: "Dashboard",
          title: "Dashboard",
        },
        {
          text: "Alerts",
          title: "Alerts",
        },
      ];
    }
  }

  tabChange(event: any) {
    this.tab = event.title;
    this.archiveToggle = false;
    this.toggleLabel = "Hide Archived Alerts";
    if (this.tab === "TEMPLATES") {
      this.isToggle = true;
    } else {
      this.isToggle = false;
    }
  }

  clickButton(e: any) {
    if (e == "template") {
      this.router.navigate(["admin/alerts/add-alert-template"]);
    } else if (e == "alert") {
      this.router.navigate(["admin/alerts/new-alert"]);
    }
  }

  changeArchived(e: any) {
    this.archiveToggle = e;
    this.toggleLabel = this.archiveToggle
      ? "Show Archived Alerts"
      : "Hide Archived Alerts";
    if (this.tab == "UNPUBLISHED") {
      this.unpublished.getArchivedEvent(e);
    } else if (this.tab == "PUBLISHED") {
      this.published.getArchivedEvent(e);
    } else {
      this.templates.getArchivedEvent(e);
    }
  }
  navigateInto(params: any) {
    if (
      params.text.toLowerCase() === "dashboard" ||
      params.title.toLowerCase() === "dashboard"
    ) {
      this.router.navigate(["../"], { relativeTo: this.activatedRoute });
    }
  }
}
