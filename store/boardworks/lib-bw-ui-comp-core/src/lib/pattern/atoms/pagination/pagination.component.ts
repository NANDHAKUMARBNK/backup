import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  public gridView!: GridDataResult;
  @Input() height: any = 400;
  @Input() pageSize: any = 1;
  @Input() skip: any = 0;
  @Input() pageable: boolean = true;
  // @Input() gridView: any;
  @Input() previousNext: boolean = true;
  @Input() buttonCount: any = 5;
  @Input() pageSizes: boolean = true;
  @Output() change = new EventEmitter();

  items: any[] = [
    {
      Id: "Kanika",
      CompanyName: "Alfreds Futterkiste",
      ContactName: "Maria Anders",
      ContactTitle: "Sales Representative",
      City: "Berlin",
    },
    {
      Id: "Bansal",
      CompanyName: "Ana Trujillo Emparedados y helados",
      ContactName: "Ana Trujillo",
      ContactTitle: "Owner",
      City: "México D.F.",
    },
    {
      Id: "Heena",
      CompanyName: "Antonio Moreno Taquería",
      ContactName: "Antonio Moreno",
      ContactTitle: "Owner",
      City: "México D.F.",
    },
  ];

  constructor() {
    // this.change.emit({skip:0, take:1});
    this.loadItems();
  }

  ngOnInit(): void {}

  public pageChange(event: PageChangeEvent): void {
    console.log(event);
    this.skip = event.skip;
    this.pageSize = event.take;
    // this.change.emit(event);
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length,
    };
  }
}
