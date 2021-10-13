import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormArray,
  FormGroup,
} from "@angular/forms";

@Component({
  selector: "bw-radio",
  templateUrl: "./radio.component.html",
  styleUrls: ["./radio.component.scss"],
})
export class RadioComponent implements OnInit {
  @Input() control: any;
  @Input() maxlength: any = 10000;
  @Input() minlength: any = 0;
  @Input() name: any = "common";
  @Input() radios: any = [
    {
      name: "Default",
      value: "defalut",
      selected: true,
    },
  ];
  @Input() label: any;
  @Input() errorMessageName: any;
  @Input() classRadioLabel: any = "k-label";
  @Input() helpText: any;
  @Input() inRow = false;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;
  @Output() change = new EventEmitter();
  @Output() getselectedArray = new EventEmitter();
  @Output() getSelectedValue = new EventEmitter();
  @Output() getselectedName = new EventEmitter();
  @Input() optionalLabel = "";
  @Input() toolTip = "";
  @Input() toolTipInput = "";
  @Input() toolTipClass = "mdi mdi-information icon";
  @Input() classNameControl: any = "";
  @Input() labelClass: any = "bw-font-sec-bold";
  @Input() divClass = "";
  @Input() colClass = "";
  @Input() radioDate:any;
  @Input() controlDate:any;
  @Input() minDate:any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log(this.control, "control");
  }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.radios) {
      console.log(this.radios);
    }
  }

  getSelectedRadio(id: any) {
    this.getselectedArray.emit(id);
  }
}
