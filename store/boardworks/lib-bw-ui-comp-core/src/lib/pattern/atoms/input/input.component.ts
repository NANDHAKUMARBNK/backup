import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectorRef, OnChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'bw-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnChanges {

  @Input() control: any;
  @Input() maxlength: any = 1000;
  @Input() minlength: any = 0;
  @Input() label: any;
  @Input() labelClass: any = 'bw-font-sec-bold';
  @Input() errorMessageName: any;
  @Input() prefix: any;
  @Input() class: any = '';
  @Input() type: any = 'text';
  @Input() isStar: any = true;
  @Input() placeholder: any;
  @Input() helpText: any;
  @Input() inRow = false;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;
  @Output() change = new EventEmitter();
  @Output() focusout = new EventEmitter();
  @Input() height = 'auto';
  @Input() optionalLabel = '';
  @Input() toolTip = '';
  @Input() toolTipIconClass = 'mdi mdi-information icon';
  @Input() toolTipClass = 'tooltip-top';
  @Input() classNameControl: any = '';
  @Input() customErrorMinLength: any;
  @Input() customErrorReq: any;
  @Input() customErrorPattern: any;
  @Input() customErrormaxLength: any;
  @Input() customErrormax: any;
  @Input() customErrormin: any;
  @Input() labelPositionClass: any = '';


  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  inputChange(event: any) {
    this.change.emit(event);
  }

  keyPress(event: any) {
    const inputLength = event.target.value.length;
    const inputChar =
      event.charCode >= 48 && event.charCode <= 57 && event.charCode !== 45;
    if (inputLength === this.maxlength || !inputChar) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  inputValue(controlValue: any) {
    this.focusout.emit(controlValue);
  }

}
