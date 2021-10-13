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
  selector: "bw-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent implements OnInit, OnChanges {
  @Input() control: any;
  @Input() maxlength: any = 10000;
  @Input() minlength: any = 0;
  @Input() checkBoxses: any = [
    {
      name: "Default",
      value: "defalut",
      selected: true,
    },
  ];
  @Input() label: any;
  @Input() errorMessageName: any;
  @Input() classCheckboxLabel: any = "k-label";
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
  @Input() checkBoxTextClass: any = "col-9 checkbox-space";
  @Input() spanrowClass: any = "col-1";
  checkboxForm: any;
  selectedBoxes = [];
  @Input() isLabelLink: boolean = false;
  @Output() onClickLink: any = new EventEmitter();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.checkBoxses) {
      if (this.checkBoxses) {
        this.checkBoxses.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
      }
      this.createFormInputs();
    }
  }
  onClickHandler(e: any) {
    this.onClickLink.emit(e);
  }
  onClickCheckBox() {
    console.log(this.control.value);
  }

  createFormInputs() {
    this.checkboxForm = new FormGroup({
      checkBoxes: this.createcheckBoxes(this.checkBoxses),
    });
  }

  createcheckBoxes(checkboxses: any) {
    const arr = checkboxses.map((checkbox: any) => {
      return new FormControl(checkbox.selected || false);
    });
    console.log(new FormArray(arr).value);

    return new FormArray(arr);
  }

  getSelectedcheckBox(index: any, value: any) {
    this.getSelectedValue.emit(value);
    this.checkBoxses[index].selected = value;
    const selectedDetails: any[] = [];
    this.checkBoxses.forEach((res: any) => {
      if (res.selected) {
        selectedDetails.push({ name: res.name, value: res.value });
      }
    });
    this.getselectedArray.emit(selectedDetails);

    const names: any = [];
    if (this.checkBoxses.length > 1) {
      selectedDetails.forEach((res: any) => {
        names.push(res.name);
      });
      this.getselectedName.emit(names);
    } else {
      this.getselectedName.emit(
        selectedDetails && selectedDetails.length && selectedDetails[0].name
      );
    }

    const values: any = [];
    if (this.checkBoxses.length > 1) {
      selectedDetails.forEach((res: any) => {
        values.push(res.value);
      });
      this.getselectedName.emit(values);
    } else {
      this.getselectedName.emit(value);
    }
  }
}
