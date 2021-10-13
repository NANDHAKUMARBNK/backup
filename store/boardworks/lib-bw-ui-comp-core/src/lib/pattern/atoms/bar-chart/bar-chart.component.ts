import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bw-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() width: any = '100%';
  @Input() activeBarColor: any = 'var(--bw-bar-clr-bse)';
  @Input() pendingBarColor: any = 'transparent';
  @Input() colClass: any = '12';

  constructor() { }

  ngOnInit(): void {
  }

}
