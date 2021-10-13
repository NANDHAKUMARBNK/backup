import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { State, process } from "@progress/kendo-data-query";

import {
  PageChangeEvent,
  GridDataResult,
  GridComponent,
  RowClassArgs,
} from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { Observable, Subscription, fromEvent } from "rxjs";
import { tap, take } from "rxjs/operators";

const tableRow = (node: any) => node.tagName.toLowerCase() === "tr";

const closest = (node: any, predicate: any) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};

@Component({
  selector: "bw-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"],
})
export class GridComponentAtom implements OnInit {
  public data: any[] = [
    {
      text: "Furniture",
      items: [
        { text: "Tables & Chairs" },
        { text: "Sofas" },
        { text: "Occasional Furniture" },
      ],
    },
  ];

  @Output() onClickAction = new EventEmitter<any>();
  @Output() onClickLink = new EventEmitter<any>();
  @Output() templateClick = new EventEmitter<any>();
  @Output() accrodianClick = new EventEmitter<any>();
  @Output() readAccessClick = new EventEmitter<any>();
  @Output() writeAccessClick = new EventEmitter<any>();
  @Output() readChildAccessClick = new EventEmitter<any>();
  @Output() writeChildAccessClick = new EventEmitter<any>();
  @Output() ChildDeleteClick = new EventEmitter<any>();
  @Output() ChildLinkClick = new EventEmitter<any>();
  @Output() selectedRowChange = new EventEmitter<any>();
  @Output() flagImportantClick = new EventEmitter<any>();
  @Output() followClick = new EventEmitter<any>();
  @ViewChild("grid") grid!: any;
  @Input() isEnableIcons: any;
  @Input() isEnableSelectAll: any;
  @Input() isShowCheckbox: any;
  @Input() onCellClicked: any;
  @Input() columnOptions: any;
  @Input() columnsData: any;
  @Input() gridData: any;
  @Input() actions: any;
  @Input() isCommitteeGrid: any;
  @Input() changeTextColor: any;
  isCommitteeGridStyle: any = {
    "background-color": "#fff",
  };
  pagable: any = {};
  // new
  @Input() isEnablePagination: any;
  public gridView!: GridDataResult;
  // @Input() height: any;
  @Input() pageSize: any = 5;
  @Input() skip: any = 0;
  @Input() pageable: boolean = true;
  @Input() previousNext: boolean = true;
  @Input() buttonCount: any;
  @Input() pageSizes: boolean = true;
  @Output() change = new EventEmitter();
  scrollable: any = "none";
  autoHeight: boolean = false;
  @Input() isEnableButton: boolean = false;
  @Input() buttonName: any;
  @Output() onClickActionAccordion: any = new EventEmitter<any>();
  //@ViewChild(GridComponent) grid : GridComponent | undefined;
  @Input() insideGridComponent: any;
  @Input() isExportPdf: boolean = false;
  @Input() savePdfFlag: any;
  @Input() counter: any;
  accordianData: any;
  @Input() accesControlFlag: any = false;
  @Input() accesControlFlagForAlerts: any = false;
  @Input() statusCombo: any = [];
  @Output() getselectedArray: any = new EventEmitter<any>();
  @Output() onClick: any = new EventEmitter<any>();
  @Input() accesControlFlagForDocuments: any = false;
  @Input() accesControlFlagForDiscussion: any = false;
  @Input() sortingField: any = "name";
  @Input() showSelectAll: any;
  @Input() SelectedId: any;
  @Input() iconClass: any = "plus-circle";
  iconActionClass: any;
  @Output() dragAndDropGrid: any = new EventEmitter<any>();
  @Input() dragAndDrop: any;
  @Input() evaluationQuestionChildren: any;
  public multiple = false;
  public allowUnsort = false;
  public sort: SortDescriptor[] = [];
  @Input() totalSize: any = "";

  public state: State = {
    skip: 0,
    take: 10,
  };
  private currentSubscription: Subscription | undefined;
  @ViewChildren(GridComponent) private grids!: QueryList<GridComponent>;
  @Input() isEnableExpand: boolean = false;
  constructor(private renderer: Renderer2, private zone: NgZone) {}
  @Input() isAlertModule: any = false;
  @Output() expandAndCollapseGrid: any = new EventEmitter<any>();

  public ngOnInit(): void {
    this.iconActionClass =
      this.iconClass + " icon-sm icon-lg-size cursor-pointer mb-2";
    if (this.dragAndDrop) {
      this.gridData = process(this.gridData && this.gridData, this.state);
    }
    this.loadItems();
    if (this.gridData && this.gridData.length) this.loadItems();
    this.pagable = {
      previousNext: this.previousNext,
      buttonCount: this.buttonCount,
      pageSizes: this.pageSizes,
    };
    if (this.gridData && this.gridData.length <= 5) {
      this.scrollable = "none";
      this.autoHeight = true;
    } else {
      this.scrollable = "virtual";
      this.autoHeight = false;
    }
    this.sort = [
      {
        field: this.sortingField,
        dir: "asc",
      },
    ];
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadItems();
  }

  clickSplitButton(e: any, eventData: any) {
    console.log("======", e, eventData);
    const obj = e?.action ? e : { data: eventData, action: e };
    console.log(obj, "objobjobjobj");

    this.onClickAction.emit(obj);
  }

  ngOnChanges(): void {
    console.log("gridData", this.gridData, "columns", this.columnsData);

    if (this.evaluationQuestionChildren) {
      this.grid && this.grid.expandRow(1);
      this.gridData &&
        this.gridData.forEach((item: any, idx: any) => {
          if (item.childQuestions.length > 0) {
            this.grid.expandRow(idx);
          }
        });
    }
    if (this.gridData) this.loadItems();
    if (this.gridData && this.gridData.length <= 5) {
      this.scrollable = "none";
      this.autoHeight = true;
    } else {
      this.scrollable = "virtual";
      this.autoHeight = false;
    }
    if (this.savePdfFlag) {
      this.grid.saveAsPDF();
    }
    if (this.grid) {
      this.expandAndCollapseGrid.emit(this.grid);
    }

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  onClickHandler(e: any, type: any) {
    console.log(e);
    // const reqObj = {
    //   type: type,
    //   data: e,
    // };
    const reqObj = e?.data ? e : { type: type, data: e };

    this.onClickLink.emit(reqObj);
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    // this.change.emit(event);
    this.loadItems();
  }
  private loadItems(): void {
    this.gridData =
      this.gridData && this.gridData.length > 0
        ? orderBy(this.gridData, this.sort)
        : this.gridData;
    const grid = this.isEnablePagination
      ? this.gridData &&
        this.gridData.slice(this.skip, this.skip + this.pageSize)
      : this.gridData;
    this.gridView = {
      data: grid,
      total: this.gridData && this.gridData.length,
    };
  }
  onClickToggle(e: any) {}

  useTemplateClick(e: any) {
    this.templateClick.emit(e);
  }
  onClickAccordion(event: any) {
    this.onClickActionAccordion.emit(event);
  }
  clickButton(e: any) {
    this.onClick.emit(e);
  }
  iconClick(index: any, e: any) {
    const data = {
      event: e,
      grid: this.grid,
      rowIndex: index,
    };
    this.accrodianClick.emit(data);
  }
  followChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.followClick.emit(data);
  }
  flagImportantChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.flagImportantClick.emit(data);
  }
  readAccesChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.readAccessClick.emit(data);
  }

  writeAccesChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.writeAccessClick.emit(data);
  }

  readChildAccesChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.readChildAccessClick.emit(data);
  }

  writeChildAccesChanged(event: any, index: any, e: any) {
    const data = {
      selected: e,
      grid: this.grid,
      rowIndex: index,
      event: event,
    };
    this.writeChildAccessClick.emit(data);
  }

  onClickChildDelete(parentData: any, child: any, type: any) {
    console.log("onClickChildDelete", parentData, child, type);

    const reqObj = parentData?.child
      ? parentData
      : { parentData: parentData, child: child, type: type };

    // const reqObj = {
    //   parentData: parentData,
    //   child: child,
    //   type: type,
    // };
    this.ChildDeleteClick.emit(reqObj);
  }
  handleChangeRadios(e: any) {
    this.getselectedArray.emit(e);
  }
  handleUpdateStatus(e: any) {
    this.onClick.emit(e);
  }
  onClickChildLink(parentData: any, child: any, type: any) {
    const reqObj = parentData?.child
      ? parentData
      : { parentData: parentData, child: child, type: type };
    console.log(reqObj, "onclickchildlink");
    this.ChildLinkClick.emit(reqObj);
  }

  selectionChange(data: any) {
    this.selectedRowChange.emit(data.selectedRows);
  }

  public ngAfterViewInit(): void {
    console.log(this.gridData, "ngAfterViewInit");
    if (this.dragAndDrop) {
      this.currentSubscription = this.handleDragAndDrop();
    }
  }

  public ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  public dataStateChange(state: State): void {
    if (this.dragAndDrop) {
      this.state = state;
      this.gridData = process(this.gridData, this.state);
      this.currentSubscription?.unsubscribe();
      this.zone.onStable
        .pipe(take(1))
        .subscribe(() => (this.currentSubscription = this.handleDragAndDrop()));
    }
  }

  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {});
    let draggedItemIndex: number;

    const tableRows = Array.from(document.querySelectorAll(".k-grid tr"));
    tableRows.forEach((item) => {
      this.renderer.setAttribute(item, "draggable", "true");
      const dragStart = fromEvent<DragEvent>(item, "dragstart");
      const dragOver = fromEvent(item, "dragover");
      const dragEnd = fromEvent(item, "dragend");

      sub.add(
        dragStart
          .pipe(
            tap(({ dataTransfer }) => {
              try {
                const dragImgEl = document.createElement("span");
                dragImgEl.setAttribute(
                  "style",
                  "position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;"
                );
                document.body.appendChild(dragImgEl);
                dataTransfer?.setDragImage(dragImgEl, 0, 0);
              } catch (err) {
                // IE doesn't support setDragImage
              }
              try {
                // Firefox won't drag without setting data
                dataTransfer?.setData("application/json", "");
              } catch (err) {
                // IE doesn't support MIME types in setData
              }
            })
          )
          .subscribe(({ target }) => {
            const row: HTMLTableRowElement = <HTMLTableRowElement>target;
            draggedItemIndex = row.rowIndex;
            const dataItem = this.gridData.data[draggedItemIndex];
            dataItem.dragging = true;
          })
      );

      sub.add(
        dragOver.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
          const dropIndex = closest(e.target, tableRow).rowIndex;
          const dropItem = this.gridData.data[dropIndex];

          draggedItemIndex = dropIndex;
          this.zone.run(() =>
            this.gridData.data.splice(dropIndex, 0, dataItem)
          );
        })
      );

      sub.add(
        dragEnd.subscribe((e: any) => {
          e.preventDefault();
          const dataItem = this.gridData.data[draggedItemIndex];
          dataItem.dragging = false;
          this.gridData.data.map((item: any, index: any) => {
            item.reOrder = index;
            return item;
          });
          this.dragAndDropGrid.emit(this.gridData, "this.gridData");
        })
      );
    });

    return sub;
  }

  getStatusClass(item: any) {
    if (item == "Published") {
      return "arrow-right success";
    } else if (item == "Unpublished") {
      return "arrow-right warning";
    } else {
      return "arrow-right archived";
    }
  }

  getArchiveClass(item: any) {
    return item && "arrow-right archived";
  }

  // function for recursive grids for folders
  accrodianClickSubinfosites(data: any) {
    if (data.event.isSelected) {
      data.event.isSelected = false;
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.event.isSelected = true;
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.collaborationId == element.collaborationId) {
        element.isUpDown = !element.isUpDown;
        element.isSelected = !element.isSelected;
      }
    });
  }
}
