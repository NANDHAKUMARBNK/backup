import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bw-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() onLabel: any = ' ';
  @Input() offLabel: any = ' ';
  @Input() readonly: any = false;
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() valueChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onFocus(controlValue: any) {
    this.focus.emit(controlValue);
  }

  onBlur(controlValue: any) {
    this.blur.emit(controlValue);
  }

  onChange(controlValue: any) {
    this.valueChange.emit(controlValue);
  }

}
