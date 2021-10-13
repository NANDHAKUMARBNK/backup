import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "bw-basic-loader",
  templateUrl: "./basic-loader.component.html",
  styleUrls: ["./basic-loader.component.scss"],
})
export class BasicLoaderComponent implements OnInit {
  @Input() type: any;
  @Input() color: any;
  @Input() size: any;
  constructor() {}

  ngOnInit(): void {}
}
