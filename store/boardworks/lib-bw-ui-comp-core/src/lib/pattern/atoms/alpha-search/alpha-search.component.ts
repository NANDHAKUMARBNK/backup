import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bw-alpha-search',
  templateUrl: './alpha-search.component.html',
  styleUrls: ['./alpha-search.component.scss']
})
export class AlphaSearchComponent implements OnInit {
  alphabetsString = 'abcdefghijklmnopqrstuvwxyz';
  alphabets: any;
  searchedLetter = 'ALL';
  searchedAllLetter = 'ALL'
  @Output() onClick = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.alphabets = this.alphabetsString.toUpperCase().split('');
    this.alphabets.splice(0,0,'ALL');    
  }

  clickEvent(event: any) {
    this.searchedLetter = event;
    this.onClick.emit(event);
    this.searchedAllLetter = ''
  }

  ClickEventAll(name: any) {
    this.searchedAllLetter = name;
    this.searchedLetter = ''
    this.onClick.emit(name);
  }

}
