import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarousalComponent } from './components/carousal/carousal.component';
import { VideouploadComponent } from './components/videoupload/videoupload.component';
import { RegistermodelComponent } from './components/registermodel/registermodel.component';
import { DoctorvideouploadComponent } from './components/doctorvideoupload/doctorvideoupload.component';
import { PublicComponent } from './components/public/public.component';
import { CelebrityComponent } from './components/celebrity/celebrity.component';
import { OfficialComponent } from './components/official/official.component';
import { RamonsiddhaComponent } from './components/ramonsiddha/ramonsiddha.component';
import { MgronsiddhaComponent } from './components/mgronsiddha/mgronsiddha.component';
import { CcrsonsiddhaComponent } from './components/ccrsonsiddha/ccrsonsiddha.component';
import { PrimeministeronsiddhaComponent } from './components/primeministeronsiddha/primeministeronsiddha.component';
import { DrjayalalithaComponent } from './components/drjayalalitha/drjayalalitha.component';
import { RetoonsiddhaComponent } from './components/retoonsiddha/retoonsiddha.component';
import { SanitizeUrlPipePipe } from './pipes/sanitize-url-pipe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { OrderModule } from 'ngx-order-pipe';
import { SuccessComponent } from './components/success/success.component';
import { RegisterComponent } from './components/register/register.component';
import { CustomgraphComponent } from './components/customgraph/customgraph.component';
import { TamilnadumedicinemapComponent } from './components/tamilnadumedicinemap/tamilnadumedicinemap.component';
import { GraphpopulationComponent } from './components/graphpopulation/graphpopulation.component';
import { TamilnadudistrictmapComponent } from './components/tamilnadudistrictmap/tamilnadudistrictmap.component';
import { PrivacypolicyComponent } from './components/privacypolicy/privacypolicy.component';
import { DoctorgraphdivergentComponent } from './components/doctorgraphdivergent/doctorgraphdivergent.component';
import { CombographComponent } from './components/combograph/combograph.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { HomeV1Component } from './components/home-v1/home-v1.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CarousalComponent,
    VideouploadComponent,
    RegistermodelComponent,
    DoctorvideouploadComponent,
    PublicComponent,
    CelebrityComponent,
    OfficialComponent,
    RamonsiddhaComponent,
    MgronsiddhaComponent,
    CcrsonsiddhaComponent,
    PrimeministeronsiddhaComponent,
    DrjayalalithaComponent,
    RetoonsiddhaComponent,
    SanitizeUrlPipePipe,
    SuccessComponent,
    RegisterComponent,
    CustomgraphComponent,
    GraphpopulationComponent,
    TamilnadumedicinemapComponent,
    TamilnadudistrictmapComponent,
    PrivacypolicyComponent,
    DoctorgraphdivergentComponent,
    CombographComponent,
    AnnouncementsComponent,
    HomeV1Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OrderModule,
    ChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    // HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    Title,
    {
      provide: LOCALE_ID,
      useValue: 'en-IN',
    },
  ],
  bootstrap: [AppComponent],
  //entryComponents: [HomeComponent],
})
export class AppModule {}
