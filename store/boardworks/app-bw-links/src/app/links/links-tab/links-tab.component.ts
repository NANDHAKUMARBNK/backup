import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { LinksService } from "lib-bw-svc-apis/src/lib/links/links.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";

@Component({
  selector: "app-links-tab",
  templateUrl: "./links-tab.component.html",
  styleUrls: ["./links-tab.component.scss"],
})
export class LinksTabComponent implements OnInit, OnDestroy {
  tabsData: any = [
    {
      title: "LINK FOLDERS",
      content: "",
      isSelected: true,
      isDisabled: true,
    },
    {
      title: "LINKS",
      content: "This is Address Tab",
      isSelected: false,
      isDisabled: false,
    },
  ];
  tab = true;
  folderId: any;
  floderName: any;
  tabTitile: any;
  path: any;
  // tabSubscription: Subscription | undefined;
  private unsubscribe$: Subject<any> = new Subject<any>();
  userPermission: any;
  addFloder = false;
  addLink = false;
  constructor(
    private router: Router,
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private linkService: LinksService,
    private stroge: StorageService
  ) {
    this.folderId = this.activateRoute.snapshot.params.id;
    this.floderName = this.activateRoute.snapshot.params.name;
    if (activateRoute.snapshot.queryParams.path) {
      this.path = activateRoute.snapshot.queryParams.path;
    }
  }

  ngOnInit(): void {
    this.userPermission =
      this.stroge.getData("userPermission") &&
      JSON.parse(this.stroge.getData("userPermission"));
    this.userPermission &&
      this.userPermission.forEach((element: any) => {
        if (element.action == "AddFolder" && element.permission == "Allow") {
          this.addFloder = true;
        }

        if (element.action == "AddItem" && element.permission == "Allow") {
          this.addLink = true;
        }
      });

    this.linkService
      .getLinksTabObs()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tab: any) => {
        if (tab == "LINKS") {
          this.tab = false;
          this.tabsData = [
            {
              title: "LINK FOLDERS",
              content: "",
              isSelected: false,
              isDisabled: true,
            },
            {
              title: "LINKS",
              content: "This is Address Tab",
              isSelected: true,
              isDisabled: false,
            },
          ];
        } else {
          this.tab = true;
          this.tabsData = [
            {
              title: "LINK FOLDERS",
              content: "",
              isSelected: true,
              isDisabled: true,
            },
            {
              title: "LINKS",
              content: "This is Address Tab",
              isSelected: false,
              isDisabled: false,
            },
          ];
        }
      });
  }

  newFloder(event: any) {
    //  this.router.navigate(['newFloder']);
    if (this.folderId) {
      this.router.navigate(
        [`../../../../createInsideFloder/${this.folderId}/${this.floderName}`],
        { queryParams: { path: this.path }, relativeTo: this.activateRoute }
      );
    } else {
      this.router.navigate([`createFolder`], {
        queryParams: { path: this.path },
        relativeTo: this.activateRoute,
      });
    }
  }
  newLink(event: any) {
    if (this.folderId) {
      this.router.navigate(
        [`../../../../createInsideLink/${this.folderId}/${this.floderName}`],
        { queryParams: { path: this.path }, relativeTo: this.activateRoute }
      );
    } else {
      this.router.navigate([`createLink/LINK`], {
        queryParams: { path: this.path },
        relativeTo: this.activateRoute,
      });
    }
  }

  tabChange(event: any) {
    this.tabTitile = event.title;
    if (event.title == "LINKS") {
      this.tab = false;
    } else {
      this.tab = true;
    }
  }

  folderClick() {
    this.router.navigate(["admin/links"]);
    // this.router.navigateByUrl('admin/links', { skipLocationChange: true }).then(() => {
    //   this._location.back();
    // });
  }

  ngOnDestroy(): void {
    //this.unsubscribe$.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.linkService.setLinksTabObs(" ");
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  backNavigation() {
    this._location.back();
  }
}
