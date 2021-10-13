import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultComponent
  ],
  imports: [
    CommonModule, AppRoutingModule, LibBwUiCompCoreModule
  ],
  exports: [SearchComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
