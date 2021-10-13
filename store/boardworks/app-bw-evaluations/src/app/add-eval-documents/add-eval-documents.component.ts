import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from "@angular/common";
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';

@Component({
  selector: 'app-add-eval-documents',
  templateUrl: './add-eval-documents.component.html',
  styleUrls: ['./add-eval-documents.component.scss']
})
export class AddEvalDocumentsComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Evaluations",
      title: "Evaluations",
    },
    {
      text: "Add Document",
      title: "Add Document",
    },
  ];
  documentForm: FormGroup;
  file: File | undefined;
  fileListData: any = [];
  uploadRequired: boolean = false;
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  folderName: any;
  constructor(
    private _formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private commonService: CommonService,
    private location: Location,
    private evaluationService: EvaluationsService
  ) {
    this.documentForm = this._formBuilder.group({
      fileTitle: ["", Validators.required],
      file: [""]
    });
    this.folderName = this.activateRoute.snapshot.params.name;
  }

  ngOnInit(): void {
  }

  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  uploadFile(e: any) {
    const target = e.target as HTMLInputElement;
    let files: any = target.files;
    const title = this.documentForm.get('fileTitle')?.value;
    for (let i = 0; i < files.length; i++) {
      let file = (target.files as FileList)[i];
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      this.showLoader = true;
      this.commonService.documentcache(formData).subscribe(
        (data: any) => {
          let optionalFileName = file?.name.split(".")[0];
          let documentId = data.result;
          let obj = {
            DocumentId: documentId,
            FileTitle:
              this.documentForm.get("fileTitle")?.value &&
                this.documentForm.get("fileTitle")?.value !== ""
                ? this.documentForm.get("fileTitle")?.value
                : optionalFileName,
            FileName: file?.name,
          };
          this.fileListData.push(obj);
          this.fileListData.length >= 1
            ? (this.uploadRequired = false)
            : (this.uploadRequired = true);
          this.documentForm.get("fileTitle")?.reset();
          this.documentForm.get('file')?.markAsUntouched();
          this.showLoader = false;
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showLoader = false;
        }
      );
    }
  }

  UploadFileClick(e: any) {
    if (this.fileListData.length === 0) {
      this.uploadRequired = true;
      return;
    } else {
      this.uploadRequired = false;
      if (
        this.evaluationService.documentData &&
        this.evaluationService.documentData.length > 0
      ) {
        this.fileListData.map((it: any) => {
          this.evaluationService.documentData.push(it);
        });
      } else {
        this.evaluationService.documentData = this.fileListData;
      }
      this.backNavigation();
    }
  }
  deleteIcon(item: any, index: any) {
    this.showLoader = true;
    this.commonService.deleteDocumentcache(item.DocumentId).subscribe(
      (res) => {
        this.fileListData.splice(index, 1);
        this.showLoader = false;
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
        this.showLoader = false;
      }
    );
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  seterror(e?: any) { }
  backNavigation() {
    this.location.back();
  }
  navigateInto(params: any) {
    if (params.text === "Evaluations" || params.title === "Evaluations") {
      this.backNavigation();
    }
  }

}
