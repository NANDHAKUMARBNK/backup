import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "bw-text-combobox-radio",
  templateUrl: "./text-combobox-radio.component.html",
  styleUrls: ["./text-combobox-radio.component.scss"],
  // host: {
  //   "(document:click)": "onClick($event)",
  // },
})
export class TextComboboxRadioComponent implements OnInit {
  isShowModal: boolean = false;
  @Input() formControlValue: any;
  @Input() radios: any;
  @Output() getselectedArray: any = new EventEmitter<any>();
  @Output() onClick: any = new EventEmitter<any>();
  @Input() field: any;
  radioForm: FormGroup;
  @Input() cellData: any;
  constructor(private fb: FormBuilder) {
    this.radioForm = this.fb.group({
      radioId: [""],
    });
  }

  ngOnInit(): void {
    if (this.formControlValue) {
      this.radioForm.patchValue({
        radioId: this.formControlValue,
      });
    }
  }
  handleClick() {
    this.isShowModal = !this.isShowModal;
  }
  changeRadios(e: any) {
    this.getselectedArray.emit(e);
  }
  edit(e: any, type: any) {
    if (type === "cancel") {
      this.isShowModal = false;
    } else {
      this.onClick.emit(this.cellData);
      this.isShowModal = false;
    }
  }
}
