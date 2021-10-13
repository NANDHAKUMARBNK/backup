import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent implements OnInit {
  @Input() className: any;
  @Input() src: any;
  @Input() alt: any;
  @Input() title: any;
  @Output() clickAvatar: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  onClickAvatar(e: any) {
    this.clickAvatar.emit(e);
  }
}
