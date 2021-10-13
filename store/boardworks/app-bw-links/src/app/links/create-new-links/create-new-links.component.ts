import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from 'lib-bw-svc-apis/src/lib/links/links.service';
import { Location } from '@angular/common';
import { REGEX_CONSTANTS } from 'lib-bw-svc-apis/src/lib/constant/regex';

@Component({
  selector: 'app-create-new-links',
  templateUrl: './create-new-links.component.html',
  styleUrls: ['./create-new-links.component.scss']
})
export class CreateNewLinksComponent implements OnInit {
  Urlpattern = false;
  linkDataForm: FormGroup;
  folderId: any;
  componentName: any;
  headerName = "Add New Link";
  breadCrumb = "Add New Link"

  folderName: any;
  defaultItems: any = [
    {
      text: "Add New Folder",
      title: "Add New Folder",
    },
  ];
  labelText: any = 'Add a link document to ';
  path: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private linksService: LinksService,
    private _location: Location
  ) {
    this.linkDataForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.maxLength(100)]],
      url: ['', [Validators.required,Validators.pattern(REGEX_CONSTANTS.website)]]

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
      this.headerName = "Edit Link"

      // this.floderDataForm.patchValue({
      //   name: ['', Validators.required],
      //   description: ['', [Validators.maxLength(100)]],

      // })
    } else {
      this.labelText = this.path ? this.labelText + `'${this.path}'` : this.labelText + `'Links'`
    }
  }


  getById(id: any) {
    this.linksService.getEditLinksById(id).subscribe((data: any) => {
      this.breadCrumb = data.result.title;
      this.linkDataForm.patchValue({
        title: data.result.title,
        description: data.result.description,
        url: data.result.url

      })
      if (this.headerName == "Edit Link") {
        this.labelText = `Update the link document '${this.linkDataForm.value.title}'`
      }
    })
  }

  seterror(e?: any) {
  }

  cancelLink(event: any) {
    this._location.back();
    this.linksService.setLinksTabObs("LINKS");

  };

  saveLink(event: any) {
    if (this.linkDataForm.invalid) {
      this.linkDataForm.markAllAsTouched();
      return;
    }

    if (this.Urlpattern) {
      return
    }

    let reqObj
    if (this.folderId) {
      reqObj = {
        title: this.linkDataForm.get('title')?.value,
        description: this.linkDataForm.get('description')?.value,
        url: this.linkDataForm.get('url')?.value,
        folderId: this.folderId
      }
    } else {
      reqObj = this.linkDataForm.value;
    }
    if (this.folderId && this.componentName) {
      this.linksService.updateLinks(reqObj, this.folderId).subscribe((data: any) => {
        this._location.back();
        this.linksService.setLinksTabObs("LINKS");

      },
        error => {

        }
      )

    } else {
      this.linksService.saveLinks(reqObj).subscribe((data: any) => {
        this._location.back();
        this.linksService.setLinksTabObs("LINKS");

      },
        error => {

        }
      )
    }
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.linkDataForm.get('url')?.valueChanges.subscribe((data: any) => {
    //   const arr = data.split(".");
    //   const com = arr.slice(-1)
    //   if ((data.startsWith("https://") || data.startsWith("http://"))) {
    //     this.Urlpattern = false;
    //   } else {
    //     this.Urlpattern = true;
    //   }
    // })
  }


  keypress(event: any) {


  }

  navigateInto(event: any) {

  }

  backNavigation() {
    //this._location.back();
    this.router.navigate(['admin/links'])
    // this._location.back();
  }

}
