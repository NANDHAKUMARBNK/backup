import { ToastrService } from './../../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { CollaborationService } from './../../../../../../lib-bw-svc-apis/src/lib/collaboration/collaboration.service';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase, DialogService } from "@progress/kendo-angular-dialog";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
@Component({
  selector: "bw-reply-discussion",
  templateUrl: "./reply-discussion.component.html",
  styleUrls: ["./reply-discussion.component.scss"],
})
export class ReplyDiscussionComponent
  extends DialogContentBase
  implements OnInit {
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() discussionDetails: any;
  @Input() type: any;
  @Input() meetingId: any;
  errMessage: any;
  isError: boolean = false;
  replyForm: FormGroup;
  recepients: any;
  discussionName: any;
  isSaving:boolean=false;
  sendAlerts: any = [
    {
      name: "Checking this box will send an email to all selected users.",
      value: "Checking this box will send an email to all selected users.",
      selected: false,
    },
  ];
  discussId: any;
  discussionTitle: any = 'Reply To Discussion';
  discussionSave: any = 'reply';
  discussionBody: any = 'update';
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "name",
      title: "Boards",
      filterType: "text",
      width: '230px',
      isEnableColumnOptions: false,
    },
    {
      field: "",
      title: "User",
      filterType: "text",
      width: '230px',
      isEnableColumnOptions: false,
    },
    {
      title: "Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  gridData: any = [];
  isShowToggle: boolean = false;
  showDeleteModal: boolean = false;
  constructor(
    private meetingService: MeetingsService,
    public dialog: DialogRef,
    private fb: FormBuilder,
    private collabService: CollaborationService,
    private toastr: ToastrService,
    private dialogService: DialogService,
  ) {
    super(dialog);
    this.replyForm = this.fb.group({
      subject: [''],
      body: ["", Validators.required],
      sendAlert: [false],
    });
  }

  ngOnInit(): void {
    if(this.type == 'view' || this.type == 'update' || this.type == 'new'){
      this.replyForm.get('body')?.setValidators([]);
    }
    else{
      this.replyForm.get('body')?.setValidators(Validators.required);
    }

    this.discussionTitle = this.type == 'new' || this.type == 'view' ? 'Discussion' : 'Reply To Discussion';
    this.discussionSave = this.type == 'reply' ? 'POST' : 'SAVE';
    this.discussionBody = this.type == 'update' || this.type == 'view' || this.type == 'new' ? 'Body' : 'Reply'
    this.getRecipients();
  }
  replyDiscussionToRecipients() {
    if (this.discussionDetails) {
      const { discussionId }: any = this.discussionDetails;
      this.discussId = discussionId;
      this.meetingService
        .getDiscussionsByDiscussionId(discussionId)
        .subscribe((response: any) => {
          const { result }: any = response;
          if (result) {
            if (this.type == 'view') {
              this.replyForm.patchValue(result);
              /// Mapping Recipient's Child Access checked   
              this.gridData.map((data: any) => {
                data["usersChecked"] = [];
                data['parentWriteDisable'] = true;
                data.users.map((user: any) => {
                  user["disable"] = true;
                  const id: any = result.recipients.findIndex(
                    (ids: any) => ids.userId === user.userId
                  );
                  if (id !== -1) {
                    user["childWriteselected"] = true;
                  }
                  /// Mapping Recipient's Parent Access checked
                  data["usersChecked"].push(user["childWriteselected"]);
                  data["parentWriteselected"] = data["usersChecked"].every(
                    (e: any) => e == true
                  );
                });
              });
            }
            const { recipients, subject }: any = result;
            if (recipients && recipients.length > 0) {
              let content: any = "";
              recipients.map((item: any, i: any) => {
                if (i == recipients.length - 1) {
                  content += `${item.name}`;
                } else {
                  content += `${item.name} | `;
                }
              });
              this.recepients = content;
            }
            this.discussionName = `Re: ${subject}`;
          }
        });
    }
  }
  seterror(e?: any) { }
  onAction(e: any) {
    if (e === "cancel") {
      const req: any = {
        type: "cancel",
        data: null,
      };
      this.closeDialog.emit(req);
    } else {
      if (this.replyForm.invalid) {
        this.replyForm.markAllAsTouched();
      } else {
        let tempArr: any = [];
        this.gridData.forEach((element: any, i: any) => {
          element.users.forEach((res: any) => {
            if (res.childWriteselected && !tempArr.includes(res.userId)) {
              tempArr.push(res.userId);
            }
          });
        });
        if (this.replyForm.value.subject == '') {
          this.replyForm.value.subject = this.discussionName;
        }
        const data = {
          recipientIds: tempArr,
          subject: this.replyForm.value.subject,
          body: this.replyForm.value.body,
          sendAlert: this.replyForm.value.sendAlert,
          meetingId: this.meetingId
        }
        this.isSaving =true;
        const URL = this.type == 'new' ? this.meetingService.creteDiscussion(data) :
          this.type == 'update' ? this.meetingService.updateDiscussionById(this.replyForm.value, this.discussId) :
            this.meetingService.sendReplyByDiscussionId(this.discussId, this.replyForm.value);
        URL.subscribe((response: any) => {
          if (response) {
            const { result }: any = response;
            const req: any = {
              type: "replied",
              data: result,
            };
            this.toastr.showToastr('success', this.type == 'new' ? 'New Discussion Created Successfully!' :
              this.type == 'update' ? 'Discussion Updated Successfully!' : 'Replied to Discussion Successfully!');
              this.isSaving =false;
            this.closeDialog.emit(req);
          }
        });
      }
    }
  }
  changeCheckbox(e: any) {
    this.replyForm
      .get("sendAlert")
      ?.setValue(this.sendAlerts.map((item: any) => item.selected)[0]);
  }

  getRecipients() {
    this.collabService.getAccessControl().subscribe(
      (data: any) => {
        data.result.filter((res: any) => {
          if (res.users.length == 0) {
            res["isUpDown"] = false;
          } else {
            res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
            res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
            res["isUpDown"] = true;
          }
          res.users.map((response: any) => {
            response.childWriteselected = false;
          });
          res["isSelected"] = false;
          res.parentWriteselected = false;
        });
        this.gridData = data.result;
        this.replyDiscussionToRecipients();
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.id == element.id) {
        element.isUpDown = !element.isUpDown;
        element.isSelected = !element.isSelected;
      }
    });
  }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = false;
          });
        });
      });
    }
  }

  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = true;
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = false;
        });
      });
    }
  }

  insideAccordion(e: any) { }

  actions(e: any) {
    this.isShowToggle = !this.isShowToggle;
  }

  actionClick(e: any, type: any) {
    console.log(e, type);
    switch (type) {
      case 'edit':
        this.type = 'update';
        break;
      case 'delete':
        this.showDeleteModal = true;
        break;
    }
  }

  linksModalAction(type: any) {
    switch (type) {
      case 'yes':
      this.meetingService.deleteDiscussionById(this.discussId).subscribe((res: any) => {
        if (res) {
          this.showDeleteModal = false;
          const req: any = {
            type: "cancel",
            data: null,
          };
          this.closeDialog.emit(req);
          this.toastr.showToastr("success", "Discussion Deleted Successfully!");
        }
      });
        break;
      case 'cancel':
        this.showDeleteModal = false;
        break;
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

}
