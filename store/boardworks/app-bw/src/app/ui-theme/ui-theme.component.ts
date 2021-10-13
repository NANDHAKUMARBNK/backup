import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { HttpService } from "lib-bw-svc-apis/src/lib/http/http.service";

@Component({
  selector: "app-ui-theme",
  templateUrl: "./ui-theme.component.html",
  styleUrls: ["./ui-theme.component.scss"],
})
export class UiThemeComponent implements OnInit {
  title = "app-bw";
  _inputValue: any = "";
  isDisabled: boolean = true;
  isChecked: boolean = true;
  isRadioChecked: boolean = true;
  isCheckboxDisabled: boolean = true;
  isRadioDisabled: boolean = true;
  testForm: FormGroup;
  tabsData: any = [
    {
      title: "Profile",
      content: "This is Profile Tab",
      isSelected: false,
      isDisabled: true,
    },
    {
      title: "Address",
      content: "This is Address Tab",
      isSelected: true,
      isDisabled: false,
    },
    {
      title: "Plan",
      content: "This is Plan Tab",
      isSelected: false,
      isDisabled: false,
    },
  ];
  public gridView!: GridDataResult;
  selectdata = ["dddd", "dkjdkdkj", 1, 2];
  checkBoxses: any = [
    {
      name: "Sports",
      value: "jdjdj",
    },
    //   {
    //     name: "Music",
    //     value: "music",
    //     selected: true
    //   },
    {
      name: "Movie",
      value: "movie",
      selected: true,
    },
    {
      name: "Reading",
      value: "reading",
    },
    {
      name: "Writing",
      value: "writing",
    },
  ];
  basicArray: any = [
    {
      name: "Nandha",
      id: 1,
    },
    {
      name: "Kumar",
      id: 2,
    },
  ];
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
  cardData: any = [
    {
      title: "Mobile",
      body: "iPhone XR",
      footer: "256GB",
    },
    {
      title: "Watch",
      body: "Fasttrack",
      footer: "waterproof",
    },
  ];
  actions: any = ["create", "edit", "delete"];
  basicArrayValue: any = "item.name";
  _textareaValue: any;

  constructor(private fb: FormBuilder, private http: HttpService) {
    this.testForm = this.fb.group({
      testControl: ["", [Validators.required]],
      textArea: ["", [Validators.required]],
      checkbox: ["", [Validators.required]],
      select: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.gridView = {
      data: this.items.slice(0, 1),
      total: this.items.length,
    };
    let nav_items: any = [];
    Object.keys(this.response_login_board.result.permissions).map(
      (item: any) => {
        let navs: any = {
          name: item,
          permission: Object.values(
            this.response_login_board.result.permissions[item]
          ),
          boardRoles: this.response_login_board.result.boardRoles,
          userRole: this.response_login_board.result.userRole,
          canUseBoard: this.response_login_board.result.canUseBoard,
          correlationId: this.response_login_board.correlationId,
        };
        if (item === "Alerts") {
          navs.icon = "mdi mdi-bell-outline";
        } else if (item === "Votings") {
          navs.icon = "mdi mdi-printer-pos";
        } else if (item === "Surveys") {
          navs.icon = "mdi mdi-poll";
        } else if (item === "Profiles") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "CorporateInformation") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "DirectorsGuide") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "GeneralBoardInfo") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "MeetingsEvents") {
          navs.icon = "mdi mdi-calendar-month";
        } else if (item === "Discussions") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "Links") {
          navs.icon = "mdi mdi-link-variant";
        } else if (item === "Collaboration") {
          navs.icon = "mdi mdi-account-group";
        } else if (item === "Evaluations") {
          navs.icon = "mdi mdi-finance";
        } else {
          navs.icon = "mdi mdi-account-group";
        }
        nav_items.push(navs);
      }
    );
    this.navItems = nav_items;
  }
  loginBoards() {
    this.http
      .post(
        "Auth/LoginBoard",
        { BoardId: "8e97c1ed-8c1a-4da3-886b-a64f4639c405" },
        {}
      )
      .subscribe((response: any) => {
        console.log(response);
        // this.navItems = response
      });
  }
  seterror() {
    // this.testForm.controls.testControl.setErrors({customError: 'kjfdkjfkjf'})
  }

  change(event: any) {
    // console.log(event);
  }

  getChanges(event: any) {
    console.log(event);
    this.gridView = {
      data: this.items.slice(event.skip, event.skip + event.take),
      total: this.items.length,
    };
    // API call with updated PageNo and itemPerPage
  }

  searchData(event: any) {
    // console.log('API Call');
  }

  save(e: any) {
    alert(`${this._inputValue} Saved`);
  }
  update(e: any) {
    alert("updated");
  }
  changeText(e: any) {
    this._inputValue = e.target.value;
  }
  changeCheckbox(e: any) {
    console.log(e);
  }
  changeRadioButtons(e: any) {
    console.log(e.target.id);
  }
  changeDropdown(e: any) {
    console.log(e.target.value);
  }
  cardClickFn(e: any) {
    console.log("Card", e);
  }
  clickAvatarFn(e: any) {
    alert(`Redirect to ${e} link`);
  }
  clickSplitButton(e: any) {
    alert(e);
  }
  onClickLink(e: any) {
    alert("this is link");
  }
  // ************* Grid Data ******************
  isCommitteeGrid: boolean = true;
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "job_title",
      title: "Job Title",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "employee_name",
      title: "Employee",
      filterType: "date",
      isEnableColumnOptions: true,
    },
    {
      field: "action",
      title: "Actions",
      filterType: "boolean",
      isEnableColumnOptions: true,
    },
  ];
  gridData: any = [
    {
      id: 1,
      job_title: "HR",
      employee_name: "Nandha",
      action: null,
    },
    {
      id: 2,
      job_title: "Devops Engineer",
      employee_name: "kumar",
      action: null,
    },
    {
      id: 3,
      job_title: "Software Engineer",
      employee_name: "Hari",
      action: null,
    },
  ];
  onClickActionGrid(e: any) {
    alert(e);
  }
  // Small Grid
  isEnableSelectAll2: boolean = false;
  isShowCheckbox2: boolean = false;
  onCellClicked2: any = [];
  columnOptions2: any = {
    filter: false,
    sort: false,
    lock: false,
    stick: false,
  };
  columnsData2: any = [
    {
      field: "linkTextName",
      title: "MY COMMITTEE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
  ];
  gridData2: any = [
    {
      id: 1,
      linkTextName: "AUDIT COMMITTEE",
    },
    {
      id: 2,
      linkTextName: "BOARD OF DIRECTORS",
    },
    {
      id: 3,
      linkTextName: "DEMO COMMITTEE",
    },
    {
      id: 4,
      linkTextName: "FRAUD COMMITTEE",
    },
  ];
  onClickCommitte(e: any) {
    alert(`${e} is clicked`);
  }
  // ************Sidenav************
  navItems: any = [
    {
      name: "Search",
      icon: "mdi mdi-magnify",
      url: "",
    },
    {
      name: "Meetings & Events",
      icon: "mdi mdi-calendar-month",
      url: "",
    },
    {
      name: "Admin",
      icon: "mdi mdi-cog",
      url: "",
    },
    {
      name: "Alerts",
      icon: "mdi mdi-bell-outline",
      url: "",
    },
    {
      name: "Documents",
      icon: "mdi mdi-file-document-outline",
      url: "",
    },
    {
      name: "Evaluations",
      icon: "mdi mdi-finance",
      url: "",
    },
    {
      name: "Surveys",
      icon: "mdi mdi-poll",
      url: "",
    },
    {
      name: "Voting",
      icon: "mdi mdi-printer-pos",
      url: "",
    },
    {
      name: "Links",
      icon: "mdi mdi-link-variant",
      url: "",
    },
    {
      name: "Profiles",
      icon: "mdi mdi-account-group",
      url: "",
    },
  ];
  response_login_board: any = {
    result: {
      token: {
        accessToken:
          "329c9ca6-d290-44e7-9e40-f9ab95c78ec8|8e97c1ed-8c1a-4da3-886b-a64f4639c405|PSVUS",
        expiry: "2021-06-08T13:13:23",
      },
      userRole: "Administrators",
      canUseBoard: true,
      boardRoles: [
        {
          name: "Administrators",
          value: "Administrators",
        },
        {
          name: "Auditors",
          value: "Auditors",
        },
        {
          name: "Committee Administrators",
          value: "CommitteeAdministrators",
        },
        {
          name: "Directors",
          value: "Directors",
        },
        {
          name: "Document Administrators",
          value: "DocumentAdministrators",
        },
        {
          name: "Officers",
          value: "Officers",
        },
        {
          name: "Regulators",
          value: "Regulators",
        },
        {
          name: "Senior Officers",
          value: "SeniorOfficers",
        },
        {
          name: "Site Viewers",
          value: "SiteViewers",
        },
        {
          name: "Technical Administrators",
          value: "TechnicalAdministrators",
        },
        {
          name: "User Administrators",
          value: "UserAdministrators",
        },
      ],
      permissions: {
        Alerts: [
          {
            action: "ViewAlert",
            permission: "Allow",
          },
          {
            action: "AddAlert",
            permission: "Allow",
          },
          {
            action: "DisplayArchivedAlerts",
            permission: "Allow",
          },
          {
            action: "AddTemplate",
            permission: "Allow",
          },
          {
            action: "EditDeleteAlertTemplate",
            permission: "Allow",
          },
        ],
        CorporateInformation: [
          {
            action: "ViewCorporateInformation",
            permission: "Allow",
          },
          {
            action: "AddFolder",
            permission: "Allow",
          },
          {
            action: "AddItem",
            permission: "Allow",
          },
          {
            action: "EditFolder",
            permission: "Allow",
          },
          {
            action: "DeleteFolder",
            permission: "Allow",
          },
          {
            action: "DeleteItem",
            permission: "Allow",
          },
          {
            action: "UpdateOrder",
            permission: "Allow",
          },
        ],
        DirectorsGuide: [
          {
            action: "ViewDirectorsGuide",
            permission: "Allow",
          },
          {
            action: "AddFolder",
            permission: "Allow",
          },
          {
            action: "AddItem",
            permission: "Allow",
          },
          {
            action: "EditFolder",
            permission: "Allow",
          },
          {
            action: "DeleteFolder",
            permission: "Allow",
          },
          {
            action: "DeleteItem",
            permission: "Allow",
          },
          {
            action: "UpdateOrder",
            permission: "Allow",
          },
        ],
        GeneralBoardInfo: [
          {
            action: "ViewGeneralBoardInformation",
            permission: "Allow",
          },
          {
            action: "AddFolder",
            permission: "Allow",
          },
          {
            action: "AddItem",
            permission: "Allow",
          },
          {
            action: "EditFolder",
            permission: "Allow",
          },
          {
            action: "DeleteFolder",
            permission: "Allow",
          },
          {
            action: "DeleteItem",
            permission: "Allow",
          },
          {
            action: "UpdateOrder",
            permission: "Allow",
          },
        ],
        MeetingsEvents: [
          {
            action: "ChangeMeetingsView",
            permission: "Allow",
          },
          {
            action: "AddEditDeleteMeetingsEvents",
            permission: "Allow",
          },
          {
            action: "ViewMeetingsEvents",
            permission: "Allow",
          },
          {
            action: "ViewMeetingsAgendaItems",
            permission: "Allow",
          },
        ],
        Discussions: [
          {
            action: "ViewDiscussions",
            permission: "AllowPrivate",
          },
          {
            action: "ReplyDiscussion",
            permission: "AllowPrivate",
          },
          {
            action: "AddDiscussion",
            permission: "AllowPrivate",
          },
          {
            action: "EditDiscussion",
            permission: "AllowPrivate",
          },
          {
            action: "DeleteDiscussion",
            permission: "AllowPrivate",
          },
        ],
        Links: [
          {
            action: "ViewLinks",
            permission: "Allow",
          },
          {
            action: "AddFolder",
            permission: "Allow",
          },
          {
            action: "AddItem",
            permission: "Allow",
          },
          {
            action: "EditFolder",
            permission: "Allow",
          },
          {
            action: "EditItem",
            permission: "Allow",
          },
          {
            action: "DeleteFolder",
            permission: "Allow",
          },
          {
            action: "DeleteItem",
            permission: "Allow",
          },
        ],
        Surveys: [
          {
            action: "ViewSurveys",
            permission: "Allow",
          },
          {
            action: "CreateSurveys",
            permission: "Allow",
          },
          {
            action: "EditSurveys",
            permission: "Allow",
          },
        ],
        Votings: [
          {
            action: "ViewVoting",
            permission: "Allow",
          },
          {
            action: "CreateVoting",
            permission: "Allow",
          },
          {
            action: "EditVoting",
            permission: "Allow",
          },
        ],
        Profiles: [
          {
            action: "ViewProfiles",
            permission: "Allow",
          },
          {
            action: "ViewEditOwnProfile",
            permission: "AllowPrivate",
          },
          {
            action: "EditOtherProfiles",
            permission: "Allow",
          },
        ],
        Collaboration: [
          {
            action: "ViewCollaboration",
            permission: "Allow",
          },
          {
            action: "AddWorkspace",
            permission: "Allow",
          },
          {
            action: "AddEditDeleteDocument",
            permission: "Allow",
          },
        ],
        Evaluations: [
          {
            action: "ViewEvaluations",
            permission: "Allow",
          },
          {
            action: "CreateEvaluations",
            permission: "Allow",
          },
          {
            action: "EditEvaluations",
            permission: "Allow",
          },
        ],
      },
    },
    correlationId: "c201f092-1c29-4a15-9482-57aefacc688d",
  };
  navigateTo(params: any) {
    console.log(params);
  }
  // ****************ends**************
}
