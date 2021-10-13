import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PanelBarExpandMode } from "@progress/kendo-angular-layout";

@Component({
  selector: "bw-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.scss"],
})
export class AccordionComponent implements OnInit {
  @Output() onClickActionAccordion = new EventEmitter<any>();
  @Input() buttonName: any = "Edit";
  @Input() isEnableExpand: boolean = false;
  @Input() accordions: any;
  @Input() isEnableButton: any;
  committeesAccordionTitle: any;
  @Input() classBodyName: any;
  @Input() savePdfFlag: boolean = false;
  constructor() {}

  ngOnInit(): void {
    //default Mode
    console.log(this.accordions, "accordions");

    this.expandMode = parseInt("2", 10);
    if (this.accordions && this.accordions.length) {
      this.committeesAccordionTitle = `${this.accordions[0]} +${this.accordions.length}`;
    }
  }
  ngOnChanges(): void {
    // if (this.savePdfFlag) {
    //   this.isEnableExpand = false;
    // }
  }
  public expandMode: number = PanelBarExpandMode.Full;
  public kendoPanelBarExpandMode: any = PanelBarExpandMode;
  public height = 320;
  public onHeightChange(value: any): void {
    this.height = value;
  }
  public onPanelChange(event: any): void {}
  action(e: any, params: any) {
    const request: any = {
      rowData: e,
      rowCellData: params,
    };
    this.onClickActionAccordion.emit(request);
  }
}
