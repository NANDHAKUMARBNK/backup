import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
})
export class TabComponent implements OnInit {
  @Input() tabs: any;
  @Output() tabChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  onTabSelect(event:any){
    this.tabChange.emit(event)
  }
}
