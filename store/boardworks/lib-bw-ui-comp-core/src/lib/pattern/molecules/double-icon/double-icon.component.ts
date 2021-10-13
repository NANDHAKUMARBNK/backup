import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-double-icon",
  templateUrl: "./double-icon.component.html",
  styleUrls: ["./double-icon.component.scss"],
})
export class DoubleIconComponent implements OnInit {
  @Output() onIconSecondClick = new EventEmitter<any>();
  @Output() onIconFirstClick = new EventEmitter<any>();
  @Input() iconClassNameFirst: any = "square-edit-outline";
  @Input() iconClassNameSecond: any = "delete";
  @Input() className: any;
  @Input() width: any = "100%";
  @Input() colClass: any = "1";
  iconClassFirst: any;
  iconClassSecond: any;
  divColClass: any;
  @Output() onClick: any = new EventEmitter<any>();
  @Input() iconProperties: any;
  constructor() {}

  ngOnInit(): void {
    this.className = `row ${this.className}`;
    this.iconClassFirst = `mdi mdi-${this.iconClassNameFirst} icon`;
    this.iconClassSecond = `mdi mdi-${this.iconClassNameSecond} icon center`;
    this.divColClass = `col-sm-${this.colClass}`;
    this.iconProperties.filter((icon: any) => {
      icon.showIcon = true;
    });
  }

  onIconClick(e: any) {
    this.onClick.emit(e);
  }

  iconFirstClickEvent(e: any) {
    this.onIconFirstClick.emit(e);
  }

  iconSecondClickEvent(e: any) {
    this.onIconSecondClick.emit(e);
  }
}
