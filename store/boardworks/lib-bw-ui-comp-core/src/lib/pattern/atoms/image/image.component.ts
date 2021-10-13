import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.css"],
})
export class ImageComponent implements OnInit {
  @Input() imageId: any;
  @Input() imageClassName: any;
  @Input() imageSource: any;
  @Input() imageTitle: any;
  @Input() imageAlt: any;
  @Input() src:any;
  constructor() {}
  ngOnInit(): void {}
  @Output() handleChange: EventEmitter<any> = new EventEmitter();
  imageClickHandler(e: any) {
    this.handleChange.emit(e);
  }
}
