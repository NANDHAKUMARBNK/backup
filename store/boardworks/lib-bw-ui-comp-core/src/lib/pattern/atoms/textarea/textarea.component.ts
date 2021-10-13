import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'bw-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {
  @Input() control: any;
  @Input() maxlength: any = 10000;
  @Input() minlength: any = 0;
  @Input() label: any;
  @Input() errorMessageName: any;
  @Input() class: any = '';
  @Input() placeholder: any;
  @Input() helpText: any;
  @Input() rows: any = 5;
  @Input() inRow = false;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;
  @Output() change = new EventEmitter();
  @Output() focusout = new EventEmitter();
  @Input() optionalLabel = '';
  @Input() toolTip = '';
  @Input() toolTipIconClass = 'mdi mdi-information icon';
  @Input() toolTipClass = 'tooltip-top';
  @Input() classNameControl: any = '';
  @Input() labelClass: any = 'bw-font-sec-bold';
  @Input() labelPositionClass: any = ''

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

  inputValue(controlValue: any) {
    this.focusout.emit(controlValue);
  }

}
