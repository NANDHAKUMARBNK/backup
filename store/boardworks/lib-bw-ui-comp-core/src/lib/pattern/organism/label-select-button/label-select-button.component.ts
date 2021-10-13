import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-label-select-button",
  templateUrl: "./label-select-button.component.html",
  styleUrls: ["./label-select-button.component.scss"],
})
export class LabelSelectButtonComponent implements OnInit {
  @Output() selectChangeEvent: any = new EventEmitter<any>();
  @Output() onClick: any = new EventEmitter<any>();
  @Input() labelName: any;
  @Input() defaultItem: any;
  @Input() selectField: any;
  @Input() data: any;
  @Input() selectName: any;
  @Input() selectValue: any;
  @Input() buttonName: any;
  @Input() buttonClassName: any;
  constructor() {}
  ngOnInit(): void {}
  changeHandler(e: any) {
    this.selectChangeEvent.emit(e);
  }
  buttonClick(e: any) {
    this.onClick.emit(e);
  }
}
