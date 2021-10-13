import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationService } from 'lib-bw-svc-apis/src/lib/collaboration/collaboration.service';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {


  breadCrumb = "Add Document";
  addDocumentDataForm: FormGroup;
  file: File | undefined;
  fileListData: any = [];
  collaborationId: any;
  collaborationName: any;
  uploadRequired: boolean = false;
  collaborationData: any;
  errMessage: any;
  isError: boolean = false;
  showLoader = false;
  constructor(private fb: FormBuilder,
    private collaborationService: CollaborationService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {

    this.addDocumentDataForm = this.fb.group({
      title: [''],
      file: ['', [Validators.required]]
    })
    this.collaborationId = this.activateRoute.snapshot.params.id;
    this.collaborationName = this.activateRoute.snapshot.params.name;
  }

  ngOnInit(): void {
    this.addDocumentDataForm.get('file')?.disable();
    if (this.collaborationId) {
      this.getCollaborationById();
    }

  }

  getCollaborationById() {
    this.collaborationService.getCollaborationById(this.collaborationId).subscribe((data: any) => {
      this.collaborationData = data.result;
      //this.fileListData=data.result.documents;

    })
  }


  cancel(e: any) {
    this.router.navigate(['admin/collaborations'])

  }

  backNavigation() {
    this.router.navigate(['admin/collaborations'])

  }

  seterror(e: any) {

  }

  uploadFile(e: any) {
    const target = e.target as HTMLInputElement;
    let file = (target.files as FileList)[0];

    const formData: FormData = new FormData();
    formData.append("file", file, file.name);
    this.showLoader = true
    this.commonService.documentcache(formData).subscribe((data: any) => {
      let documentId = data.result;
      let obj = {
        "documentId": documentId,
        "fileTitle": this.addDocumentDataForm.get('title')?.value,
        "fileName": file?.name,
        // "description": "string"
      };
      this.fileListData.push(obj)
      this.fileListData.length >= 1 ? this.uploadRequired = false : this.uploadRequired = true;
      this.addDocumentDataForm.get('title')?.reset()
      this.showLoader = false
    },

      (err: any) => {
        this.setError(err.error.result.errorMessages);
        this.showLoader = false

      })

  }

  UplaodFileClick(e: any) {

    // if(this.addDocumentDataForm.invalid){
    // this.addDocumentDataForm.markAllAsTouched();
    // return
    // }
    if (this.fileListData.length === 0) {
      this.uploadRequired = true
      return
    } else {
      this.uploadRequired = false
      const reqObj = {
        documents: this.fileListData
      }

      this.collaborationService.saveDocuments(this.collaborationId, reqObj).subscribe((data: any) => {
        this.router.navigate(['admin/collaborations'])

      }, (err: any) => {
        this.setError(err.error.result.errorMessages);
      })
    }

  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  deleteIcon(item: any, index: any) {
    this.commonService.deleteDocumentcache(item.documentId).subscribe((data: any) => {
      this.fileListData.splice(index, 1);

    }, (err: any) => {
      this.setError(err.error.result.errorMessages);
    })
  }
}


