import { Component, OnInit } from "@angular/core";
import { HttpService } from "lib-bw-svc-apis/src/lib/http/http.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpService,
  ) {
    this.getToken();
  };
  ngOnInit(): void {
  }

  async getToken() {
    const token = await this.http.tokenAuthCheckAndGetToken("app");
    if (token) {
      // console.log(token);
    }
  }
}
