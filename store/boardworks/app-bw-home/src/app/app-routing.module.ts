import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./Components/forgot-password/forgot-password.component";
import { HomePageComponent } from "./Components/home-page/home-page.component";
import { SecurityQuestionsComponent } from "./Components/security-questions/security-questions.component";
import { IsNewuserGuard } from "lib-bw-svc-apis/src/lib/IsNewuser/is-newuser.guard";
import { SeeAllComponent } from "./Components/see-all/see-all.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsNewuserGuard],
    component: HomePageComponent,
  },
  {
    path: "change-password",
    canActivate: [IsNewuserGuard],
    component: ForgotPasswordComponent,
  },
  { path: "security-questions", component: SecurityQuestionsComponent },
  { path: "see-all-recent-updates", component: SeeAllComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
