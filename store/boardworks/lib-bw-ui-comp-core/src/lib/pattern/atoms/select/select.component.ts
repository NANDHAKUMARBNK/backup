import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl } from '@angular/forms';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
@Component({
  selector: "bw-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() control: any;
  @Input() label: any = '';
  @Input() errorMessageName: any;
  @Input() multiple = false;
  @Input() class = false;
  @Input() classNameControl: any = '';
  @Input() selectValue: string = '';
  @Input() selectName: string = '';
  @Input() data: any = [];
  filterdDetails: any = [];
  @Input() optionalLabel = '';
  @Input() defaultItem: any;
  @Input() inRowLabelRows = 4;
  @Input() inRowInputRows = 8;
  @Input() inRow = false;
  @Input() isKey = true;
  @Input() width = '100%';
  @Output() selectChangeEvent = new EventEmitter();
  @Output() onClick = new EventEmitter();
  @Input() searchable = true;
  @Input() height = 'auto';
  @Input() dropdownSettings: any;
  @Input() toolTip = '';
  @Input() toolTipClass = 'mdi mdi-information';
  @Input() labelClass: any = 'bw-font-sec-bold';
  @Input() inputClass: any = '';
  @Input() multiSelectPlaceholder: any = '';
  @Input() valueKey: any;
  @Input() dataItems: any;
  constructor() { }

  ngOnInit(): void {
  }

  selectChange(event: any) {
    this.selectChangeEvent.emit(event);
    console.log(document.getElementsByClassName('k-animation-container-shown')[0].innerHTML);
  }

  onClickAction() {
    this.onClick.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.label || changes.optionalLabel) {
      this.defaultItem = {
        [this.selectName || 'id']: this.label && this.label.includes('Select') ? this.label : 'Select ' + (this.label || this.optionalLabel),
        [this.selectValue || 'value']: null,
      };
    }
    if (changes.data && this.data && this.data.length) {
      this.filterdDetails = this.data.slice();
    }
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

  public filterChange(filter: any): void {
    if (!this.isKey) {
      this.filterdDetails = this.data.filter(
        (s: any) => s.toString().toLowerCase().toString().indexOf(filter.toLowerCase()) !== -1
      );
    } else {
      this.filterdDetails = this.data.filter(
        (s: any) => s[this.selectName].toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1
      );
    }
  }

  onClose(event: any) {
   // todo
  }


}
