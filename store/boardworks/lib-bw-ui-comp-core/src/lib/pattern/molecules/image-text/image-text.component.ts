import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-image-text",
  templateUrl: "./image-text.component.html",
  styleUrls: ["./image-text.component.scss"],
})
export class ImageTextComponent implements OnInit {
  @Output() clickAvatar = new EventEmitter<any>();
  @Input() classNameImg: any;
  @Input() classNameText: any;
  @Input() src: any;
  @Input() alt: any;
  @Input() title: any;
  @Input() textName: any;
  @Input() isHorizontal: any = false;
  @Input() isVertical: any = false;

  constructor() {}

  ngOnInit(): void {}
  click(e: any) {
    this.clickAvatar.emit(e);
  }
}
