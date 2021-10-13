import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase } from "@progress/kendo-angular-dialog";
import { environment } from "environments/environment";

@Component({
  selector: "bw-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent extends DialogContentBase implements OnInit {
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() headerTitle: any;
  @Input() bodyMessage: any;
  @Input() isEnableHeader: any;
  @Input() isEnableBody: any;
  @Input() isEnableFooter: any;
  @Input() isDeleteBody: any = false;
  @Input() isCustomBody: any;
  @Input() customMessage: any;
  @Input() actionButtonName: any = "SAVE";
  @Input() width: any = "700";
  @Input() height: any = "auto";
  @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter();
  @Input() modalClass: any;

  appBaseUrl: string = environment.baseUrl;
  labelClass: any;

  public actionsLayout = "normal";
  cardData: any;
  constructor(public dialog: DialogRef) {
    super(dialog);
  }
  ngOnInit(): void {
    console.log(this.isCustomBody, "isCustomBody");
  }
  public onCancelAction(): void {
    // this.closeDialog.emit(false);
    // this.dialog.close(false);
    this.onCancelClick.emit("cancel");
    // if (!this.isCustomBody || this.customMessage) {
    //   this.dialog.close({ text: "cancel" });
    // }
  }

  public onConfirmAction(): void {
    //this.closeDialog.emit(false);
    this.onConfirmClick.emit(this.actionButtonName);
    if (!this.isCustomBody || this.customMessage) {
      this.dialog.close({ text: this.actionButtonName });
    }
  }
  clickOnBoards(params: any) {
    this.dialog.close({ board: params });
  }
}
