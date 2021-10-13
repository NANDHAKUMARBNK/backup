import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase } from "@progress/kendo-angular-dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: "bw-meetings-detail-send-email-users-modal",
  templateUrl: "./send-email-modal.component.html",
  styleUrls: ["./send-email-modal.component.scss"],
})
export class MeetingsDetailSendEmailUsersModalComponent
  extends DialogContentBase
  implements OnInit
{
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() headerTitle: any;
  @Input() bodyMessage: any;
  @Input() isEnableHeader: any;
  @Input() isEnableBody: any;
  @Input() isEnableFooter: any;
  @Input() isDeleteBody: any;
  @Input() meetingId: any;
  errMessage: any;
  isError: boolean = false;
  emailForm: FormGroup;
  recepients: any;
  showLoader: boolean = false;
  constructor(
    public dialog: DialogRef,
    private fb: FormBuilder,
    private meetingService: MeetingsService
  ) {
    super(dialog);
    this.emailForm = this.fb.group({
      subject: ["", Validators.required],
      body: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    this.meetingService
      .getEmailTemplateById(this.meetingId)
      .subscribe((response: any) => {
        if (response.result) {
          this.emailForm.patchValue(response.result);
          if (
            response.result.recipients &&
            response.result.recipients.length > 0
          ) {
            let content: any = "";
            response.result.recipients.map((item: any, i: any) => {
              if (i == response.result.recipients.length - 1) {
                content += `${item.name}`;
              } else {
                content += `${item.name} | `;
              }
            });
            this.recepients = content;
          }
        }
      });
  }
  public onCancelAction(): void {
    this.dialog.close({ text: "cancel" });
  }
  seterror(e?: any) {}
  send(e: any) {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
    } else {
      this.showLoader = true;
      this.meetingService
        .postEmailSendById(this.meetingId, this.emailForm.value)
        .subscribe((response: any) => {
          if (response.result) {
            this.showLoader = false;
            this.dialog.close({ text: "send-email" });
          }
        });
    }
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
