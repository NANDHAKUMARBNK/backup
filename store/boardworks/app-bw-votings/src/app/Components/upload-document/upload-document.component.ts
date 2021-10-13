import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";

@Component({
  selector: "app-upload-document",
  templateUrl: "./upload-document.component.html",
  styleUrls: ["./upload-document.component.scss"],
})
export class UploadDocumentComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Votings",
      title: "Votings",
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
  referenceId: any;
  referenceType: any;
  sendAlert = [
    {
      name: "Send Alert",
      value: "Send Alert",
      selected: false,
    },
  ];

  constructor(
    private location: Location,
    private activateRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private votingService: VotingsServiceService,
    private router: Router
  ) {
    this.documentForm = this._formBuilder.group({
      fileTitle: ["", Validators.required],
      file: [""],
      sendAlert: [false],
    });
    this.folderName = this.activateRoute.snapshot.params.name;
    this.referenceId = this.activateRoute.snapshot.params.id;
    this.referenceType = this.activateRoute.snapshot.params.type;
  }

  ngOnInit(): void {
    // if (
    //   this.votingService.documentData &&
    //   this.votingService.documentData.length > 0
    // ) {
    //   this.fileListData = this.votingService.documentData.filter(
    //     (v: any, i: any, a: any) =>
    //       a.findIndex((t: any) => t.DocumentId === v.DocumentId) === i
    //   );
    // }
  }

  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  uploadFile(e: any) {
    
    // const title = this.documentForm.get('fileTitle')?.value && this.documentForm.get('fileTitle')?.value !== ''
    //   ? this.documentForm.get('fileTitle')?.value : this.file?.name.split(".")[0];
    const target = e.target as HTMLInputElement;
    let file = (target.files as FileList)[0];
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
        this.showLoader = false;
        // this.documentForm.get("file")?.setErrors(null);
        // this.documentForm.get("file")?.markAsUntouched();
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
        this.showLoader = false;
      }
    );
  }

  UploadFileClick(e: any) {
    if (this.fileListData.length === 0) {
      this.uploadRequired = true;
      return;
    } else {
      this.uploadRequired = false;
      if (
        this.votingService.documentData &&
        this.votingService.documentData.length > 0
      ) {
        this.fileListData.map((it: any) => {
          this.votingService.documentData.push(it);
        });
      } else {
        this.votingService.documentData = this.fileListData;
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

  changeCheckbox(e: any) {
    this.documentForm.get("file")?.markAsUntouched();
    const value = e.length > 0 ? true : false;
    this.documentForm.get("sendAlert")?.setValue(value);
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  seterror(e?: any) {}
  backNavigation() {
    this.location.back();
  }
  navigateInto(params: any) {
    if (params.text === "Votings" || params.title === "Votings") {
      this.backNavigation();
    }
  }
}
