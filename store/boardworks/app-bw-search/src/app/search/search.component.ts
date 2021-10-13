import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() topMenuFlag: any;
  searchForm: FormGroup;
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      name: ['', [Validators.required]],
      area: ['']
    });
  }

  ngOnInit(): void {
  }

  seterror(e: any) { }

  search(e: any) {
    this.topMenuFlag = !this.topMenuFlag
    this.router.navigate(["admin/search"]);
  }

  onChange(e: any) { }

}
