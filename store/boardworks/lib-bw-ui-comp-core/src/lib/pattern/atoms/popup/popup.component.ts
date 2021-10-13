import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bw-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Output() onClick = new EventEmitter<any>();
  @Input() className: any = '';
  @Input() linkText: any = '';
  show = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onClickLink(): void {
    this.onClick.emit();
    this.show = !this.show;
  }

}
