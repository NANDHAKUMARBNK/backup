import { NgModule } from "@angular/core";
// import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomePageComponent } from "./Components/home-page/home-page.component";
import { ForgotPasswordComponent } from "./Components/forgot-password/forgot-password.component";
import { SecurityQuestionsComponent } from "./Components/security-questions/security-questions.component";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/lib/lib-bw-ui-comp-core.module";
import { CommonModule } from "@angular/common";
import { SeeAllComponent } from './Components/see-all/see-all.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ForgotPasswordComponent,
    SecurityQuestionsComponent,
    SeeAllComponent,
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    AppRoutingModule,
    LibBwUiCompCoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
