import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";

@Component({
  selector: "bw-card-table",
  templateUrl: "./card-table.component.html",
  styleUrls: ["./card-table.component.scss"],
})
export class CardTableComponent implements OnInit {
  @Input() isEnableSelectAll: boolean = false;
  @Input() isShowCheckbox: boolean = false;
  @Input() onCellClicked: any = [];
  @Input() isCommitteeGrid: boolean = true;
  @Input() cards: any;
  @Input() columnOptions: any;
  @Input() columnsData: any;
  @Input() gridData: any;
  @Input() actions: any;
  @Input() width: any;
  @Output() onClickAction = new EventEmitter<any>();
  @Output() onClickLink = new EventEmitter<any>();
  @Input() cardBodyClassName:any;
  @Input() isEnablePagination: any = false;
  constructor(private toastrService: ToastrService) {}

  ngOnInit(): void {
    console.log(this.cardBodyClassName,'cardBodyClassName');
    
    this.columnOptions.filter = this.isCommitteeGrid ? false : true;
    this.columnOptions.sort = this.isCommitteeGrid ? false : true;
    this.cards.filter((card: { showTableOrList: boolean }) => {
      card.showTableOrList = true;
    });
  }

  onClickActionGrid(e: any) {
    // this.toastrService.showToastr('success', `${e} action performed Successfully!!`);
    this.onClickAction.emit(e);
  }

  onClickTextLink(e: any) {
    this.onClickLink.emit(e);
  }
}
