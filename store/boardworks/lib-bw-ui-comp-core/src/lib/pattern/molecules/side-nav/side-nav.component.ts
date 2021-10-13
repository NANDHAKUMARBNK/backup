import { ToastrService } from './../../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from "@angular/core";
import { AREAS } from 'lib-bw-svc-apis/src/lib/constant/commonConstant';

@Component({
  selector: "bw-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
})
export class SideNavComponent implements OnInit, OnChanges {
  @Output() onClick = new EventEmitter<any>();
  @Output() onBoardClick = new EventEmitter<any>();
  @Output() subMenuOnClick = new EventEmitter<any>();

  @Input() navItems: any;
  @Input() activeClass: any;
  @Input() boards: any;
  @Input() sideMenuFlag: any;
  isShowBoard: boolean = false;
  searchNav: any = "assets/images/search.png";
  boardNav: any = "assets/images/board.png";
  documents = false;
  @Input() subNavItems: any;
  @Input() topMenuFlag: any;
  searchForm: FormGroup;
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      name: ['', [Validators.required]],
      area: ['', [Validators.required]]
    });
    this.areas = AREAS;
  }

  ngOnChanges() { }
  ngOnInit(): void {
    if (this.boards && this.boards.length > 1) {
      this.isShowBoard = true;
    } else {
      this.isShowBoard = false;
    }
  }
  navigation(e: any) {
    this.onClick.emit(e);
    this.subNavItems = e.subNav;
  }

  subNavigation(e: any, type?: any) {
    const data = {
      e: e, type: type
    }
    this.subMenuOnClick.emit(data);
  }
  onClickBoard() {
    this.onBoardClick.emit(this.boards);
  }

  getLink(link: any) {
    return window.location.pathname.includes(link) ? "active" : "";
  }

  seterror(e: any) { }

  search(e: any) {
    this.subNavigation(e, 'topNav')
    this.topMenuFlag = !this.topMenuFlag
    if (this.searchForm.value.area && this.searchForm.value.area !== '') {
      this.router.navigate(["admin/search/result"], { queryParams: { board: this.searchForm.value.name, area: this.searchForm.value.area } });
    } else {
      this.toastr.showToastr('error', 'Please Select Area.')
    }
  }
}
