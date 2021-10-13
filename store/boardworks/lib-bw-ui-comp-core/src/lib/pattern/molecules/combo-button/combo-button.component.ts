import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-combo-button",
  templateUrl: "./combo-button.component.html",
  styleUrls: ["./combo-button.component.scss"],
})
export class ComboButtonComponent implements OnInit {
  @Output() onClick: any = new EventEmitter<any>();
  @Input() width: any;
  @Input() buttonProperties: any;
  @Input() buttonColClass: any = '4';
  constructor() {}

  ngOnInit(): void {
    this.buttonColClass = 12/this.buttonProperties.length;
  }
  onClickButton(e: any) {
    this.onClick.emit(e);
  }
}
