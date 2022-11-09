import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { GroupSettingsModel } from '@syncfusion/ej2-angular-grids';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-advance-table',
  templateUrl: './advance-table.component.html',
  styleUrls: ['./advance-table.component.scss'],
})
export class AdvanceTableComponent implements OnInit {
  constructor(private dataService: DataService, private http: HttpClient) {}
  tableData: any;
  groupedColumn: string[] = ['name'];
  public groupOptions: GroupSettingsModel = {
    columns: ['OrderID'],
    showDropArea: false,
  };
  ngOnInit(): void {
    // this.tableData = this.dataService.GetData();
  }
}
