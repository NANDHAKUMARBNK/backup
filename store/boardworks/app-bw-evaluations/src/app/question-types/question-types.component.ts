import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-question-types',
  templateUrl: './question-types.component.html',
  styleUrls: ['./question-types.component.scss']
})
export class QuestionTypesComponent implements OnInit {
  @Input() item: any;
  @Input() questionFormData: any;
  @Input() className: any;
  @Output() changeCheckbox: any = new EventEmitter();
  @Output() inputChange: any = new EventEmitter();
  @Output() changeRadio: any = new EventEmitter();
  @Output() noteChange: any = new EventEmitter();
  @Output() dateChange: any = new EventEmitter();
  @Output() numberChange: any = new EventEmitter();
  @Output() changeRadioSub: any = new EventEmitter();
  @Output() comboChange: any = new EventEmitter();
  booleanRadios: any = [
    {
      name: "Yes",
      value: "true",
      selected: false,
    },
    {
      name: "No",
      value: "false",
      selected: false,
    },
  ];
  questionForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder
  ) {
    this.questionForm = this._formBuilder.group({
      opinion: [''],
      checkbox: [''],
      pickDateTime: [''],
      yesOrNo: [''],
      content: [''],
      integer: [''],
      textarea: [''],
      combo: [''],
      radioSub: [''],
    });
    this.questionForm.patchValue(this.questionFormData);
  }

  ngOnInit(): void {
    this.questionForm.patchValue(this.questionFormData);
  }

  onInputChange(e: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.inputChange.emit(paramData);
  }

  onChangeCheckbox(e: any, data: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.changeCheckbox.emit(paramData);
  }

  onChangeRadio(e: any, data: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.changeRadio.emit(paramData);
  }
  
  onDateChange(e: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.dateChange.emit(paramData);
  } 
  
  onChangeRadioSub(e: any, data: any) {
    const paramData = {
      e: e, value: data
    }
    this.changeRadioSub.emit(paramData);
  }

  onNumberChange(e: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.numberChange.emit(paramData);
  }

  onComboChange(e: any, data: any) {
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.comboChange.emit(paramData);
  }

  onNoteChange(e: any){
    const paramData = {
      e: e, value: this.questionForm.value
    }
    this.noteChange.emit(paramData);
  }

}
