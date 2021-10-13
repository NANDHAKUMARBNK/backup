import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UiThemeComponent } from "./ui-theme/ui-theme.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "lib-bw-svc-apis/src/lib/interceptor/interceptor.service";
import { DialogRef, DialogsModule } from "@progress/kendo-angular-dialog";
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';





@NgModule({
  declarations: [AppComponent, UiThemeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DialogsModule,
    NavigationModule,
    ExcelExportModule,
    IndicatorsModule,
    SchedulerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: DialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
