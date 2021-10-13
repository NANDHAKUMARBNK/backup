import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { LinksService } from 'lib-bw-svc-apis/src/lib/links/links.service';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';
import { ConfirmModalComponent } from 'lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-links-floder',
  templateUrl: './links-floder.component.html',
  styleUrls: ['./links-floder.component.scss']
})
export class LinksFloderComponent implements OnInit {

  actions: any;

  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: 'link'
    },

    {
      field: "description",
      title: "Description",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "linksCount",
      title: "#Links",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "action",
      title: "Actions",
      componnet: "action",
      isEnableColumnOptions: false,
      component: 'action'

    },
  ];
  gridData: any;
  folderId: any;
  selectedFolder: any;
  path: any;
  userPermission: any;
  showdeleteFloder: boolean = false;
  selectedData: any;


  constructor(private router: Router,
    private dialogService: DialogService,
    private activateRoute: ActivatedRoute,
    private linsService: LinksService,
    private stroge: StorageService
  ) {
    this.folderId = this.activateRoute.snapshot.params.id;
    if (this.activateRoute.snapshot.queryParams.path) {
      this.path = this.activateRoute.snapshot.queryParams.path;
    }
  }




  ngOnInit(): void {
    let actiontempArray: any = []
    this.userPermission = JSON.parse(this.stroge.getData('userPermission'))
    this.userPermission && this.userPermission.forEach((element: any) => {

      if ((element.action == "EditFolder" && (element.permission == "Allow" || element.permission == "AllowPrivate"))) {
        //   this.actions = ["Edit"];
        actiontempArray.push("Edit")
      }
      if (element.action == "DeleteFolder" && (element.permission == "Allow" || element.permission == "AllowPrivate")) {
        // this.actions = ["Delete"];
        actiontempArray.push("Delete")

      }
    });


    if (actiontempArray.length == 0) {
      this.columnsData.forEach((columnsData: any) => {
        if (columnsData.component == "action") {
          columnsData.component = " "
          columnsData.title = " "
        }
      });
    }
    this.actions = actiontempArray;

    // else if (element.action == "EditFolder" && element.permission == "Deny") {

    // }


    if (this.folderId) {
      this.getLinksFolderById(this.folderId);
    } else {
      this.getLinksFloder();
    }

  }


  getLinksFloder() {
    this.linsService.getLinkFloder().subscribe((floder: any) => {
      let tempAarry: any = [];
      if (floder.result.length > 0) {
        floder.result.forEach((element: any) => {
          if (element.canEdit && element.canDelete) {
            this.actions = ["Edit", "Delete",];
          } else if (element.canEdit) {
            this.actions = ["Edit"];
          }
          else if (element.canDelete) {
            this.actions = ["Delete"];
          }
          else if (element.canEdit == false && element.canDelete == false) {
            this.actions = [];
            console.log(this.columnsData, 'columnsData');
            this.columnsData.forEach((columnsData: any) => {
              if (columnsData.component == "action") {
                columnsData.component = " "
                columnsData.title = " "
              }
            });

          }
          if (element.name) {
            let tempObj = { linkTextName: element.name };
            let data = { ...tempObj, ...element }
            tempAarry.push(data);
            this.gridData = tempAarry
          }

        });
      } else {
        this.gridData = []
      }

      //this.gridData = floder.result;
    },
      error => {

      }
    )
  };

  getLinksFolderById(id: any) {
    this.linsService.getLinkFloderById(id).subscribe((floder: any) => {
      if (floder.result.length > 0) {
        let tempAarry: any = [];
        floder.result.forEach((element: any) => {
          if (element.canEdit && element.canDelete) {
            this.actions = ["Edit", "Delete",];
          } else if (element.canEdit) {
            this.actions = ["Edit"];
          }
          else if (element.canDelete) {
            this.actions = ["Delete"];
          } else if (element.canEdit == false && element.canDelete == false) {
            this.actions = [];
            console.log(this.columnsData, 'columnsData');
            this.columnsData.forEach((columnsData: any) => {
              if (columnsData.component == "action") {
                columnsData.component = " "
                columnsData.title = " "
              }
            });

          }
          if (element.name) {
            let tempObj = { linkTextName: element.name };
            let data = { ...tempObj, ...element }
            tempAarry.push(data);
            this.gridData = tempAarry
          }

        });

      } else {
        this.gridData = []
      }
    },
      error => {

      }
    )
  }



  onClickAction(event: any) {
    if (event.action == 'Edit') {
      this.router.navigate([`admin/links/editFloder/${event.data.folderId}/Edit`])

    } else if (event.action == 'Delete') {
      this.selectedData=event;
      this.showdeleteFloder = true;
    }

  }



  deleteFloder(id: any) {
    this.linsService.deleteLinkFloder(id).subscribe((del: any) => {
      this.showdeleteFloder=false;
      this.selectedData="";
      if (this.folderId) {
        this.getLinksFolderById(this.folderId);
      } else {
        this.getLinksFloder();
      }
    },
      error => {
      }
    )
  };


  onClickLink(event: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`admin/links/folder/${event.data.folderId}/${event.data.name}/${event.data.name}`], { queryParams: { path: this.path ? this.path + '/' + event.data.name : event.data.name } }); // navigate to same route
    });
  }

  floderModalAction(type: any) {
   console.log(type,'typeeeee');
   if(type=='save'){
    this.deleteFloder(this.selectedData.data.folderId)
   }else{
    this.showdeleteFloder=false;
    this.selectedData="";

   }
  }

}
