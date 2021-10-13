import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-icon-input",
  templateUrl: "./icon-input.component.html",
  styleUrls: ["./icon-input.component.scss"],
})
export class IconInputComponent implements OnInit {
  @Output() onIconSecondClick = new EventEmitter<any>();
  @Output() onIconFirstClick = new EventEmitter<any>();
  @Input() control: any = "";
  @Input() type: any = "text";
  @Input() rows: any;
  @Input() isStar: any = false;
  @Input() iconClassName: any = "email";
  @Input() isTextarea: any = false;
  @Input() className: any;
  @Input() width: any = "100%";
  @Input() colClass: any = "2";
  @Input() placeholder: any = "Enter";
  iconClass: any;
  divColClass: any;
  @Input() textClass: any;
  constructor() {}

  ngOnInit(): void {
    this.iconClass = `mdi mdi-${this.iconClassName} icon`;
    this.divColClass = `col-sm-${this.colClass}`;
    this.textClass = `col-sm-${this.textClass}`;
  }

  iconClickEvent(e: any) {
    this.onIconFirstClick.emit(e);
  }

  seterror() {}
}
