import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bw-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() hoverText: any;
  @Input() iconClass: any;
  @Input() title: any;
  @Input() id: any;
  @Input() className: any;
  constructor() { }

  ngOnInit(): void {
  }

}
