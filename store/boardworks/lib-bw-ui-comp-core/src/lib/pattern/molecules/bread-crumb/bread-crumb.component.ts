import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BreadCrumbItem } from "@progress/kendo-angular-navigation";
import { Router } from "@angular/router";

@Component({
  selector: "bw-bread-crumb",
  templateUrl: "./bread-crumb.component.html",
  styleUrls: ["./bread-crumb.component.scss"],
})
export class BreadCrumbComponent implements OnInit {
  @Output() onClick: any = new EventEmitter<any>();
  @Input() defaultItems: any = [];
  @Input() className: any = "";
  ngOnInit(): void {}
  constructor(private router: Router) {}

  public onItemClick(item: BreadCrumbItem): void {
    this.onClick.emit(item);
    const index = this.defaultItems.findIndex((e: any) => e.text === item.text);
    this.defaultItems = this.defaultItems.slice(0, index + 1);
    // this.router.navigate([item.text]);
  }
}
