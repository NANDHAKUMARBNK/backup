import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DialogCloseResult,
  DialogService,
} from "@progress/kendo-angular-dialog";
import { LinksService } from "lib-bw-svc-apis/src/lib/links/links.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-links",
  templateUrl: "./links.component.html",
  styleUrls: ["./links.component.scss"],
})
export class LinksComponent implements OnInit {
  actions: any = ["Edit", "Delete"];

  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "title",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "description",
      title: "Description",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "linkTextName",
      title: "Url",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      field: "action",
      title: "Actions",
      component: "action",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any;
  folderId: any;
  userPermission: any;
  showdeleteLink: boolean = false;
  selectedData: any;
  constructor(
    private router: Router,
    private dialogService: DialogService,
    private activateRoute: ActivatedRoute,
    private linsService: LinksService,
    private stroge: StorageService
  ) {
    this.folderId = this.activateRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    let actiontempArray: any = [];
    this.userPermission = JSON.parse(this.stroge.getData("userPermission"));
    this.userPermission &&
      this.userPermission.forEach((element: any) => {
        // if (element.action == "EditFolder" && (element.permission == "Allow" || element.permission == "AllowPrivate") && element.action == "DeleteFolder" && (element.permission == "Allow" || element.permission == "AllowPrivate")) {
        //   this.actions = ["Edit", "Delete"];
        if (
          element.action == "EditFolder" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          //   this.actions = ["Edit"];
          actiontempArray.push("Edit");
        }
        if (
          element.action == "DeleteFolder" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          // this.actions = ["Delete"];
          actiontempArray.push("Delete");
        }
      });

    if (actiontempArray.length == 0) {
      this.columnsData.forEach((columnsData: any) => {
        if (columnsData.component == "action") {
          columnsData.component = " ";
          columnsData.title = " ";
        }
      });
    }
    this.actions = actiontempArray;

    if (this.folderId) {
      this.getLinksById(this.folderId);
    } else {
      this.getLinks();
    }
  }

  getLinks() {
    this.linsService.getLinks().subscribe(
      (links: any) => {
        //this.gridData = links.result;
        let tempAarry: any = [];
        if (links.result.length > 0) {
          links.result.forEach((element: any) => {
            if (element.canEdit && element.canDelete) {
              this.actions = ["Edit", "Delete"];
            } else if (element.canEdit) {
              this.actions = ["Edit"];
            } else if (element.canDelete) {
              this.actions = ["Delete"];
            } else if (element.canEdit == false && element.canDelete == false) {
              this.actions = [];
              console.log(this.columnsData, "columnsData");
              this.columnsData.forEach((columnsData: any) => {
                if (columnsData.component == "action") {
                  columnsData.component = " ";
                  columnsData.title = " ";
                }
              });
            }
            if (element.url) {
              let tempObj = { linkTextName: element.url };
              let data = { ...tempObj, ...element };
              tempAarry.push(data);
              this.gridData = tempAarry;
            }
          });
        } else {
          this.gridData = [];
        }
      },
      (error) => {}
    );
  }

  getLinksById(id: any) {
    this.linsService.getLinksById(id).subscribe(
      (links: any) => {
        let tempAarry: any = [];
        if (links.result.length > 0) {
          links.result.forEach((element: any) => {
            if (element.canEdit && element.canDelete) {
              this.actions = ["Edit", "Delete"];
            } else if (element.canEdit) {
              this.actions = ["Edit"];
            } else if (element.canDelete) {
              this.actions = ["Delete"];
            } else if (element.canEdit == false && element.canDelete == false) {
              this.actions = [];
              console.log(this.columnsData, "columnsData");
              this.columnsData.forEach((columnsData: any) => {
                if (columnsData.component == "action") {
                  columnsData.component = " ";
                  columnsData.title = " ";
                }
              });
            }
            if (element.url) {
              let tempObj = { linkTextName: element.url };
              let data = { ...tempObj, ...element };
              tempAarry.push(data);
              this.gridData = tempAarry;
            }
          });
        } else {
          this.gridData = [];
        }
      },
      (error) => {}
    );
  }

  onClickAction(event: any) {
    if (event.action == "Edit") {
      this.router.navigate([`admin/links/editLink/${event.data.linkId}/Edit`]);
    } else if (event.action == "Delete") {
      this.showdeleteLink = true;
      this.selectedData = event;
    }
  }

  deleteLink(id: any) {
    this.linsService.deleteLinks(id).subscribe(
      (del: any) => {
        this.showdeleteLink = false;
        this.selectedData = "";
        if (this.folderId) {
          this.getLinksById(this.folderId);
        } else {
          this.getLinks();
        }
      },
      (error) => {}
    );
  }

  onClickLink(event: any) {
    window.open(event.data.linkTextName, "_blank");
  }

  linksModalAction(type: any) {
    console.log(type, "typeeeee");
    if (type == "save") {
      this.deleteLink(this.selectedData.data.linkId);
    } else {
      this.showdeleteLink = false;
      this.selectedData = "";
    }
  }
}
