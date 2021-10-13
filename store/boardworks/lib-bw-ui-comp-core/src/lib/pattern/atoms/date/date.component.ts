import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  OnChanges,
} from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";

@Component({
  selector: "bw-date",
  templateUrl: "./date.component.html",
  styleUrls: ["./date.component.scss"],
})
export class DateComponent implements OnInit {
  @Input() timePicker: any;
  @Input() calendarType: any;
  @Input() dateValue: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() control: any;
  @Input() maxlength: any = 1000;
  @Input() minlength: any = 0;
  @Input() label: any;
  @Input() labelClass: any = "bw-font-sec-bold";
  @Input() errorMessageName: any;
  @Input() prefix: any;
  @Input() class: any = "";
  @Input() type: any = "text";
  @Input() isStar: any = true;
  @Input() helpText: any;
  @Input() inRow = false;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;
  @Input() height = "auto";
  @Input() optionalLabel = "";
  @Input() classNameControl: any = "";
  @Input() customErrorMinLength: any;
  @Input() customErrorReq: any;
  @Input() customErrorPattern: any;
  @Input() customErrormaxLength: any;
  @Input() customErrormax: any;
  @Input() customErrormin: any;
  @Input() placeholder: any;
  @Input() format: FormatSettings = {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "dd/MM/yyyy",
  };

  // public format: FormatSettings = {
  //   displayFormat: "dd/MM/yyyy",
  //   inputFormat: "dd/MM/yy",
  // };

  @Input() timeValue: any;
  @Input() timeControl: any;
  @Output() change = new EventEmitter();
  @Output() focusout = new EventEmitter();

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

  inputChange(event: any) {
    this.change.emit(event);
  }

  inputOut(controlValue: any) {
    this.focusout.emit(controlValue);
  }
}
