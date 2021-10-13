import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  OnChanges,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: "bw-input-file",
  templateUrl: "./input-file.component.html",
  styleUrls: ["./input-file.component.scss"],
})
export class InputFileComponent implements OnInit {
  @Input() control: any;

  @Input() label: any;
  @Input() labelClass: any = "bw-font-sec-bold";
  @Input() errorMessageName: any;
  @Input() prefix: any;
  @Input() class: any = "";
  @Input() type: any = "text";
  @Input() isStar: any = true;
  @Input() requiredField: any = false;
  @Input() helpText: any;
  @Input() inRow = false;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;

  @Input() height = "auto";
  @Input() optionalLabel = "";
  @Input() toolTip = "";
  @Input() toolTipIconClass = "mdi mdi-information icon";
  @Input() toolTipClass = "tooltip-top";
  @Input() classNameControl: any = "";
  @ViewChild("fileupload") element!: ElementRef;
  @Input() mutiple: any;
  @Output() upload: EventEmitter<any> = new EventEmitter();
  @Input() isUploadFile: boolean = false;
  @Input() accept: any;
  @Input() btnClass =
    "btn-base browsebtn px-5   bw-font-prm-regular btn-md py-2";

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  validator(control: any) {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  uploadFile(e: any) {
    this.upload.emit(e);
  }

  OnClickUplaod(e: any) {
    this.element.nativeElement.click();
  }
}
