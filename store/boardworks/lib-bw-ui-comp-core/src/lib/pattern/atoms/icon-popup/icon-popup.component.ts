import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bw-icon-popup',
  templateUrl: './icon-popup.component.html',
  styleUrls: ['./icon-popup.component.scss']
})
export class IconPopupComponent implements OnInit {

  @Output() onClick = new EventEmitter<any>();
  @Input() className: any = '';
  @Input() linkText: any = '';
  @Input() iconClass: any;
  showIcon = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onClickIcon(): void {
    this.onClick.emit();
    this.showIcon = !this.showIcon;
  }

}
