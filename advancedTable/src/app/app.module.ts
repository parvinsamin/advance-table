import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdvanceTableComponent } from './components/advance-table/advance-table.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { AgGridModule } from 'ag-grid-angular';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {
  PageService,
  SortService,
  FilterService,
  GroupService,
} from '@syncfusion/ej2-angular-grids';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, AdvanceTableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    AgGridModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [PageService, SortService, FilterService, GroupService],
  bootstrap: [AppComponent],
})
export class AppModule {}
