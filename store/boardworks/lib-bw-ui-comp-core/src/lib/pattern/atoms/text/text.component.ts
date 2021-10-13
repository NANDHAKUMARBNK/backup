import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-text",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"],
})
export class TextComponent implements OnInit {
  @Output() onClick = new EventEmitter<any>();
  @Input() className: any;
  @Input() textName: any;
  @Input() isEnableClick: any;
  @Input() isText: boolean = false;
  @Input() isEllipse: any = false;
  @Input() ellipseText: any = "";
  isShowEllipse: boolean = true;
  ellipse: any = "";
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges() {
    if (this.ellipseText) {
      this.ellipse = this.ellipseText;
    }
  }
  onClickText(e: any) {
    this.onClick.emit(e);
  }
  onClickTextEllipse(e: any) {
    this.isShowEllipse = !this.isShowEllipse;
    if (this.isShowEllipse) {
      this.ellipse = this.ellipseText;
    } else {
      this.ellipse = this.textName;
    }
  }
}
