import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() className: any;
  @Input() buttonName: any;
  @Input() buttonDisabled: any;
  @Input() withIcon: any;
  @Input() showButton: any = true;
  @Input() width: any = ''
  constructor() {}

  ngOnInit(): void {}
  onClickHandler(e: any) {
    this.onClick.emit(e);
  }
}
