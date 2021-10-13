import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ROLES } from 'lib-bw-svc-apis/src/lib/constant/commonConstant';

@Component({
  selector: 'app-survey-home',
  templateUrl: './survey-home.component.html',
  styleUrls: ['./survey-home.component.scss']
})
export class SurveyHomeComponent implements OnInit {
  tabsData: any = [];
  publishedTabData = {
    title: "PUBLISHED",
    content: "",
    isSelected: true,
    isDisabled: true,
  };
  unPublishedTabData = {
    title: "UNPUBLISHED",
    content: "",
    isSelected: false,
    isDisabled: false,
  };
  templateTabData = {
    title: "TEMPLATES",
    content: "",
    isSelected: false,
    isDisabled: false,
  };
  tab: any = "PUBLISHED";
  role: any;
  canCreateSurvey: any = false;
  userPermission: any;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    this.role = JSON.parse(window.sessionStorage['roles_data']);
    this.userPermission = JSON.parse(window.sessionStorage['rolePermission']);
    if (this.role.type == ROLES.administrators ||
      this.role.type == ROLES.documentAdmins ||
      this.role.type == ROLES.userAdmins) {
      this.tabsData.push(this.publishedTabData);
      this.tabsData.push(this.unPublishedTabData);
      this.tabsData.push(this.templateTabData);
    } else {
      this.tabsData.push(this.publishedTabData);
    }
    this.userPermission && this.userPermission.permission && this.userPermission.permission.Surveys && this.userPermission.permission.Surveys.forEach((element: any) => {
      if (element.action == "CreateSurveys" && element.permission == "Allow") {
        this.canCreateSurvey = true
      }
    })
  }

  ngOnInit(): void {
  }

  tabChange(event: any) {
    this.tab = event.title;
  }

  clickButton(e: any) {
    if (e == "template") {
      this.router.navigate(["./newSurveyTemplate"], { relativeTo: this.activateRoute, queryParams: { type: 'template' } });
    } else if (e == "survey") {
      this.router.navigate(["./newSurvey"], { relativeTo: this.activateRoute });
    }
  }

}
