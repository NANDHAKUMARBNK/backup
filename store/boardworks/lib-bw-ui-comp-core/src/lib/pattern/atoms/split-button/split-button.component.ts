import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-split-button",
  templateUrl: "./split-button.component.html",
  styleUrls: ["./split-button.component.scss"],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class SplitButtonComponent implements OnInit {
  isShowToggle: boolean = false;
  @Output() onClickAction: EventEmitter<any> = new EventEmitter();
  @Input() actions: any;
  @Input() className: any;
  @Input() buttonName: any;

  constructor(private _eref: ElementRef) { }

  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
      this.isShowToggle = false
  }
  ngOnInit(): void { }
  clickToggle(params: any) {
    this.isShowToggle = !this.isShowToggle;
  }
  onClickActionEvent(params: any) {
    this.onClickAction.emit(params);
    this.isShowToggle=false;
  }
}
