import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-horizontal-label",
  templateUrl: "./horizontal-label.component.html",
  styleUrls: ["./horizontal-label.component.scss"],
})
export class HorizontalLabelComponent implements OnInit {
  @Input() labelName: any;
  @Input() textName: any;
  @Input() isHorizontal: any;
  @Input() isVertical: any;
  @Input() labelClassName: any;
  @Input() textClassName: any;
  @Input() textClass: any;
  @Input() colClass: any;
  @Input() isTextLink: any = false;
  @Input() linkClassName: any = "";
  @Output() onClick = new EventEmitter();
  @Input() isViewAlertDocument: any = false;
  @Input() labelPositionClass: any = "";
  @Input() isEllipse: any = false;
  @Input() ellipseText: any = "";
  constructor() {}
  ngOnInit(): void {
    this.textClass = `col-sm-${this.textClass}`;
    this.colClass = `col-sm-${this.colClass}`;
  }

  onClickLink(e: any) {
    this.onClick.emit(e);
  }
}
