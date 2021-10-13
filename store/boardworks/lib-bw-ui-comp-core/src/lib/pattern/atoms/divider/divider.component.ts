import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bw-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.css']
})
export class DividerComponent implements OnInit {
  _dividerId: any;
  _dividerName: any;
  constructor() { }

  ngOnInit(): void {
  }

}
