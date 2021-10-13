import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLES } from 'lib-bw-svc-apis/src/lib/constant/commonConstant';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';

@Component({
  selector: 'app-evaluations-home',
  templateUrl: './evaluations-home.component.html',
  styleUrls: ['./evaluations-home.component.scss']
})
export class EvaluationsHomeComponent implements OnInit {
  publishedTabData: any = {
    title: "PUBLISHED",
    content: "",
    isSelected: true,
    isDisabled: true,
  };
  unPublishedTabData: any = {
    title: "UNPUBLISHED",
    content: "This is unpublished Tab",
    isSelected: false,
    isDisabled: false,
  };
  templateTabData: any = {
    title: "TEMPLATES",
    content: "This is templates Tab",
    isSelected: false,
    isDisabled: false,
  };
  tabsData: any = [];
  tab: any = "PUBLISHED";
  userPermission: any;
  createEvaluations: boolean = false;
  directorView: boolean = true;

  constructor(
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit(): void {
    let roles_data = JSON.parse(this.storage.getData("roles_data"));
    console.log(roles_data.type, 'roles_data');
    if (roles_data.type == ROLES.administrators || roles_data.type == ROLES.documentAdmins || roles_data.type == ROLES.userAdmins) {
      this.tabsData.push(this.publishedTabData);
      this.tabsData.push(this.unPublishedTabData);
      this.tabsData.push(this.templateTabData);
    } else {
      this.tabsData.push(this.publishedTabData);
    }

    this.userPermission = this.storage.getData('rolePermission') && JSON.parse(this.storage.getData('rolePermission'));
    this.userPermission && this.userPermission.permission && this.userPermission.permission.Evaluations && this.userPermission.permission.Evaluations.forEach((element: any) => {
      if (element.action == "CreateEvaluations" && element.permission == "Allow") {
        this.createEvaluations = true
      }
    })
  }
  newTemplate(e: any) {
    this.router.navigate(["newEvaluation"], {
      relativeTo: this.activatedRoute,
      queryParams: { type: 'template' },
    });
  }

  evaluation(e: any) {
    this.router.navigate(['newEvaluation'], { relativeTo: this.activatedRoute })
  }

  tabChange(event: any) {
    this.tab = event.title;

  }
}
