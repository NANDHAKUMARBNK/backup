import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "bw-label",
  templateUrl: "./label.component.html",
  styleUrls: ["./label.component.scss"],
})
export class LabelComponent implements OnInit {
  @Input() labelName: any;
  @Input() labelFor: any;
  @Input() className: any;
  @Input() width: any = '100%';
  constructor() {}

  ngOnInit(): void {}
}
