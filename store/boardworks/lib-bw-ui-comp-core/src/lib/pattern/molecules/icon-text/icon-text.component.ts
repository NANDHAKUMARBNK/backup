import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-icon-text",
  templateUrl: "./icon-text.component.html",
  styleUrls: ["./icon-text.component.scss"],
})
export class IconTextComponent implements OnInit {
  @Output() onClickLink = new EventEmitter<any>();
  @Output() onIconClick = new EventEmitter<any>();
  @Input() iconClassName: any = "icon-sm";
  @Input() isLink: any;
  @Input() className: any;
  @Input() linkTextName: any;
  @Input() textName: any;
  @Input() width: any = "100%";
  @Input() colClass: any = "1";
  @Input() isEnableIcons: any;
  iconClass: any;
  divColClass: any;
  divRowClass: any;
  @Input() rowClass: any;
  @Input() textClass: any;
  constructor() {}

  ngOnInit(): void {
    this.iconClass = `mdi mdi-${this.iconClassName}`;
    this.divColClass = `col-sm-${this.colClass}`;
    this.divRowClass = `row ${this.rowClass}`;
    this.textClass = `col-sm-${this.textClass}`;
    
  }
  onClick(e: any) {
    console.log(e,'e');
    
    this.onClickLink.emit(e);
  }

  iconClickEvent(e: any) {
    this.onIconClick.emit(e);
  }
}
