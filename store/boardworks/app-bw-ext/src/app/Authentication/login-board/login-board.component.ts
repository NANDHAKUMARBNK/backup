import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "lib-bw-svc-apis/src/lib/login/login.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-login-board",
  templateUrl: "./login-board.component.html",
  styleUrls: ["./login-board.component.scss"],
})
export class LoginBoardComponent implements OnInit {
  appBaseUrl: string = environment.baseUrl;
  boards: any = [];
  isError = false;
  errMessage: any = [];
  bwUrl: any = "assets/images/logo-new.png";
  constructor(
    private loginService: LoginService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards() {
    let boards = this.storage.getData("boards");
    this.boards = (boards && JSON.parse(boards)) || [];
    if (!this.boards.length) {
      this.router.navigate(["/login"]);
    }
  }

  selectBoardsClick(boardId: any) {
    this.isError = false;
    this.loginService
      .selectBoardAndRolesAndPermission({ boardId }, "auth")
      .subscribe(
        (res: any) => {
          if (res.result) {
            const userToken = {
              token: res.result.token.accessToken,
              expiry: res.result.token.expiry,
            };
            this.storage.setData("loggedInBoard", boardId);
            this.storage.setData("userToken", JSON.stringify(userToken));
            if (res.result.canUseBoard) {
              this.storage.setData(
                "roles_data",
                JSON.stringify(res.result.userRole)
              );
              this.storage.setData(
                "pagePermission",
                JSON.stringify(res.result.permissions)
              );
              this.storage.setData(
                "leftNavs",
                JSON.stringify(res.result.leftNavs)
              );
              this.router.navigate(["/admin"]);
            } else {
              this.setError(["Cannot use this board, please try another"]);
            }
          }
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
        }
      );
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
