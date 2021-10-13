import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "bw-div",
  templateUrl: "./div.component.html",
  styleUrls: [],
})
export class DivComponent implements OnInit {
  @Input() className: any;
  @Input() divId: any;
  @Input() divChild: any;
  constructor() {}
  ngOnInit(): void {}
}
