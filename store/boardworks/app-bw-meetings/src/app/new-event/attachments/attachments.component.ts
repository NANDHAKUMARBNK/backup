import { ToastrService } from './../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { MeetingsService } from 'lib-bw-svc-apis/src/lib/meetings/meetings.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  attachmentForm: FormGroup;
  file: File | undefined;
  fileListData: any = [];
  uploadRequired: boolean = false;
  showLoader: boolean = false;
  errMessage: any;
  meetingData: any;
  isPublished: boolean = false;
  status: any;
  buttonName: any;
  isError: boolean = false;
  eventId: any;
  meetingId: any;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private meetingsService: MeetingsService,
    private toastr: ToastrService
  ) {
   
    
    this.eventId = this.activatedRoute.snapshot.queryParams.eventId;
   
    this.attachmentForm = this._formBuilder.group({
      file: ['', Validators.required],
      fileTitle: ['']
    });
    this.meetingId = this.activatedRoute.snapshot.queryParams.meetingId;
    this.status = this.activatedRoute.snapshot.queryParams.status;
  }
  

  ngOnInit(): void {
    this.getEventAttachments();
        
  }

  getEventAttachments() {
    this.meetingsService.getEventAttachments(this.eventId).subscribe(res => {
      if (res.result) {
        res.result.map((data: any) => {
          let obj = {
            "documentId": data.documentId,
            "fileTitle": data.title,
            "fileName": data.fileName,
          };
          this.fileListData.push(obj);
        })
       }
    })
  }

  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  extensionFiles(file: any, e: any) {
    const allowedExtensions: any = [
      "pdf",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "csv",
      "TIF",
      "RTF",
      "GIF",
      "txt",
      "png",
      "jpg",
      "vsd",
      "vsdx",
      "doc",
      "docx",
    ];
    const fileExtension: any = file.name.split(".").pop();
    if (this.isInArray(allowedExtensions, fileExtension)) {
      return file;
    } else {
      return;
    }
  }

  uploadFile(e: any) {
    const target = e.target as HTMLInputElement;
    let files : any = target.files;
    const title = this.attachmentForm.get('fileTitle')?.value;
    for (let i = 0; i < files.length; i++) {
      let file = (target.files as FileList)[i];
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      this.showLoader = true
      this.commonService.documentcache(formData).subscribe((data: any) => {
        let documentId = data.result;
        let obj = {
          "documentId": documentId,
          "fileTitle": title,
          "fileName": file?.name,
        };
        this.fileListData.push(obj)
        this.fileListData.length >= 1 ? this.uploadRequired = false : this.uploadRequired = true;
        this.attachmentForm.get('fileTitle')?.reset();
        this.attachmentForm.get('file')?.markAsUntouched();
        this.showLoader = false
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
        this.showLoader = false
      })
    }
  }

  UploadFileClick(e: any) {
    if (this.fileListData.length === 0) {
      this.uploadRequired = true
      return
    } else {
      this.uploadRequired = false
      const reqObj = {
        eventDocuments: this.fileListData
      }
      this.meetingsService.addEventAttachment(this.eventId, reqObj).subscribe((data: any) => {
        this.toastr.showToastr('success', 'File Uploaded Successfully!');
      }, (err: any) => {
        this.setError(err.error.result.errorMessages);
      })
    }
  }

  deleteIcon(item: any, index: any) {
    this.commonService.deleteDocumentcache(item.documentId).subscribe((data: any) => {
      this.fileListData.splice(index, 1);
      this.toastr.showToastr('success', 'File Deleted Successfully!');
    }, (err: any) => {
      this.setError(err.error.result.errorMessages);
    })
  }


  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  seterror(e: any) {
    console.log(e);
  }

  clickButton(type: any) {
    switch (type) {
      case 'cancel':
        this.router.navigate(['admin/meetings']);
        break;
      case 'save':
        if (this.fileListData.length > 0) {
            this.toastr.showToastr('success', 'Event Updated Successfully!')
            this.router.navigate(['admin/meetings']);
        } else {
          this.toastr.showToastr('info', 'Please upload Attachment!')
        }
        break;

        case 'publish':
          this.meetingsService.publishEvent(this.eventId).subscribe(response => {
          this.toastr.showToastr('success', 'Event Published Successfully!')
          this.router.navigate(['admin/meetings']);
        })
        break;
      case 'unPublish':
        this.meetingsService.unPublishEvent(this.eventId).subscribe(response => {
          this.toastr.showToastr('success', 'Event UnPublished Successfully!')
          this.router.navigate(['admin/meetings']) });

        break;
    }
  }
 

}
