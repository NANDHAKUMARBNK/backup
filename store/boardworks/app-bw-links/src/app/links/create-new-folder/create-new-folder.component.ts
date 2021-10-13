import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from 'lib-bw-svc-apis/src/lib/links/links.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-new-folder',
  templateUrl: './create-new-folder.component.html',
  styleUrls: ['./create-new-folder.component.scss']
})
export class CreateNewFolderComponent implements OnInit {
  floderDataForm: FormGroup;
  folderId: any;
  componentName: any;
  headerName = "Add New Folder";
  breadCrumb = "Add New Folder"
  defaultItems: any = [
    {
      text: "Add New Folder",
      title: "Add New Folder",
    },
  ];
  folderName: any;
  editData: any;
  labelText: any = 'Add a new folder to ';
  path: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private linksService: LinksService,
    private _location: Location,

    private activateRoute: ActivatedRoute) {
    this.floderDataForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.maxLength(100)]],

    })
    this.folderId = this.activateRoute.snapshot.params.id;
    this.componentName = this.activateRoute.snapshot.params.page;
    this.folderName = this.activateRoute.snapshot.params.name
    let breadCrumbObject: any = [
      {
        title: this.folderName,
        text: this.folderName,
      },
    ];
    this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
    if (activateRoute.snapshot.queryParams.path) {
      this.path = activateRoute.snapshot.queryParams.path
    }
  }

  ngOnInit(): void {
    if (this.folderId && this.componentName) {
      this.getById(this.folderId);
      this.headerName = "Edit Folder"
      // this.floderDataForm.patchValue({
      //   name: ['', Validators.required],
      //   description: ['', [Validators.maxLength(100)]],

      // })
    } else {
      this.labelText = this.path ? this.labelText + `'${this.path}'` : this.labelText + `'Links'`
    }

  }

  getById(id: any) {
    this.linksService.getEditFloderById(id).subscribe((data: any) => {
      this.editData=data.result;
      this.breadCrumb=data.result.name;
      // console.log(this.breadCrumb,'breadCrumb');
      
      this.floderDataForm.patchValue({
        name: data.result.name,
        description: data.result.description,

      })
      if ( this.headerName == "Edit Folder") {
        this.labelText = `Update the folder '${this.floderDataForm.value.name}'`
      }
    })
  }



  seterror(e?: any) {
  }

  cancelFloder(event: any) {
    this._location.back();
    this.linksService.setLinksTabObs("LINK FOLDERS");


    // this.floderDataForm.reset()
  };

  saveFloder(event: any) {
    if (this.floderDataForm.invalid) {
      this.floderDataForm.markAllAsTouched();
      return;
    }
    let reqObj
    if (this.folderId) {
      reqObj = {
        name: this.floderDataForm.get('name')?.value,
        description: this.floderDataForm.get('description')?.value,
        parentFolderId: this.folderId
      }
    } else {
      reqObj = this.floderDataForm.value;
    }
    if (this.folderId && this.componentName) {
      this.linksService.updateLinkFloder(reqObj, this.folderId).subscribe((data: any) => {
        // this.router.navigate(['links']);
        this._location.back();
        this.linksService.setLinksTabObs("LINK FOLDERS");

      },
        error => {

        }
      )
    } else {
      this.linksService.saveLinkFloder(reqObj).subscribe((data: any) => {
        this._location.back();
        this.linksService.setLinksTabObs("LINK FOLDERS");


      },
        error => {

        }
      )
    }
  }

  navigateInto(event: any) {
    // console.log(event, 'event');

  }

  backNavigation() {
   // this._location.back();
   this.router.navigate(['admin/links'])
   // this._location.back();
  }
}
