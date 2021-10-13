import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-link",
  templateUrl: "./link.component.html",
  styleUrls: ["./link.component.scss"],
})
export class LinkComponent implements OnInit {
  @Output() onClickLink = new EventEmitter<any>();
  @Input() className: any;
  // @Input() href: any;
  @Input() target: any;
  @Input() linkText: any;
  @Input() isEnableIcons: any;
  constructor() {}

  ngOnInit(): void {}
  onClick(e: any) {    
    this.onClickLink.emit(e);
  }
  onClickHandler() {
    return false;
  }
}
