import { ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../../lib-bw-svc-apis/src/lib/common/common.service';
import { HomeService } from 'lib-bw-svc-apis/src/lib/home/home.service';
import { Validators } from '@angular/forms';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AREAS } from 'lib-bw-svc-apis/src/lib/constant/commonConstant';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  searchForm: FormGroup;
  areas: any = [];
  defaultSortItem = { name: "Date", value: '' };
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      field: "area",
      title: "Area",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "date",
      title: "Date Created",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any = [];
  searchKeyword: any;
  pageNo: any = 1;
  itemPerPage: any = 10;

  constructor(
    private fb: FormBuilder,
    // private router: Router,
    private homeService: HomeService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      name: [this.activatedRoute.snapshot.queryParams.board, [Validators.required]],
      area: [this.activatedRoute.snapshot.queryParams.area],
      startDate: [''],
      endDate: ['']
    });
    this.areas = AREAS;
  }

  ngOnInit(): void {
    // this.searchResult();
    this.search();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id) {
      this.search();
    }
  }

  seterror(e: any) { }

  search(filter?: any) {
    const data = {
      keyword: this.searchForm.value.name || '',
      startDate: this.searchForm.value.startDate && this.searchForm.value.startDate !== '' ? new Date(this.searchForm.value.startDate).toISOString() : '',
      endDate: this.searchForm.value.endDate && this.searchForm.value.endDate !== '' ? new Date(this.searchForm.value.endDate).toISOString() : '',
      area: this.searchForm.value.area || null,
      // pageNo: this.pageNo,
      // itemPerPage: this.itemPerPage,
    }
    this.homeService.getSearchedData(data).subscribe(res => {
      res.result.map((data: any) => {
        data['linkTextName'] = data.title || data.referenceTitle;
        data['area'] = data.itemType;
        data['date'] = this.commonService.formatDate(data.createdDate);
      })
      this.gridData = res.result;
    })
  }

  searchResult(e?: any) {
    this.homeService.getRecentUpdates().subscribe(res => {
      res.result.map((data: any) => {
        data['linkTextName'] = data.title;
        data['area'] = data.entity;
        data['date'] = this.commonService.formatDate(data.createdDate);
      })
      this.searchForm.patchValue(res.result);
    })
  }

  onClickLink(e: any) { }

  onChange(e: any) { }
}
