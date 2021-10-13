import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bw-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements OnInit {
  @Input() buttons: any;
  @Output() selectedBtnChange: EventEmitter<any> = new EventEmitter();
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  selectedChange(e: any, data: any) {
    const reqObj = {
      event: e,
      data: data
    }
    this.selectedBtnChange.emit(reqObj)
  }

  buttonClicked(e: any, data: any) {
    const reqObj = {
      event: true,
      data: data
    }
    if (data.multiChange) {
      this.selectedBtnChange.emit(reqObj)
    }
  }
}
