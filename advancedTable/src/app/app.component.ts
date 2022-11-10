import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/services/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export class Group {
  level = 0;
  parent!: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'advancedTable';
  public dataSource = new MatTableDataSource<any | Group>([]);
  _allData!: any[];
  columns: any[];
  displayedColumns: string[];
  test: string[] = [];
  groupByColumns: string[] = [];

  constructor(protected dataSourceService: DataService) {
    this.columns = [
      {
        field: 'id',
      },
      {
        field: 'vin',
      },
      {
        field: 'brand',
      },
      {
        field: 'year',
      },
      {
        field: 'color',
      },
    ];
    this.displayedColumns = this.columns.map((column) => column.field);
    this.test = this.displayedColumns;
    console.log(this.test);
    this.groupByColumns = ['brand'];
    this.displayAbleColumns();
  }

  ngOnInit() {
    /**
     * getting data from service
     */
    this.dataSourceService.getAllData().subscribe(
      (data: any) => {
        data.data.forEach((item: any, index: any) => {
          item.id = index + 1;
        });
        this._allData = data.data;
        this.dataSource.data = this.addGroups(
          this._allData,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
      },
      (err: any) => console.log(err)
    );
  }
  /**
   *
   * @param data contains  a row
   * @returns if data is instance of group we are calling its visible function otherwise we are calling
   * getDataRowVisible
   */
  customFilterPredicate(data: any | Group): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  /**
   * @param data contains a row
   * @returns return boolean depends on parent visibilty true or false
   */
  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter((row) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns.forEach((column) => {
        if (
          !row[column as keyof Group] ||
          !data[column] ||
          row[column as keyof Group] !== data[column]
        ) {
          match = false;
        }
      });
      return match;
    });

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  /**
   * expend and unexpend the row and filter the dataSource
   * @param row contains a particular row on which other data is dependent like brand
   */
  groupHeaderClick(row: any) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();
  }

  /**
   * @param data all the data of table
   * @param groupByColumns like brand, id etc
   * @returns all the sub level groups like brand->id->color
   */
  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }
  /**
   * its a recursive function
   * @param data all data of table
   * @param level current group by rows
   * @param groupByColumns all the columns on which rows are hide or shown like brand,id and color
   * @param parent parent like brand, id so brand is the parent of id
   * @returns returns a result of group type on which all the levels are added to the data
   */
  getSublevel(
    data: any[],
    level: number,
    groupByColumns: string[],
    parent: Group
  ): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map((row) => {
        const result: any = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }),
      JSON.stringify
    );

    const currentColumn = groupByColumns[level];
    let subGroups: any = [];
    groups.forEach((group: any) => {
      const rowsInGroup = data.filter(
        (row) => group[currentColumn] === row[currentColumn]
      );
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(
        rowsInGroup,
        level + 1,
        groupByColumns,
        group
      );
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a: any, key: any) {
    const seen: any = [];
    return a.filter((item: any) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  /**
   *
   * @param index index of row in a table
   * @param item complete row
   * @returns returning the level of row like is it in brand or nested id and so on(1,2,....)
   */
  isGroup(index: any, item: any): boolean {
    return item.level;
  }

  /**
   * @param event gets the current menu clicked
   * @param column current column to group like color
   */

  groupBy(event: any, column: any) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._allData, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
    this.displayAbleColumns();
  }

  /**
   * to check that field already exist in group or not.
   * if not then add.
   * @param field current field to group
   * @param add boolean true because we want to add this field to goup
   */
  checkGroupByColumn(field: any, add: any) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }
  /**
   * excluding columns which are included in groupByColumns
   */
  displayAbleColumns() {
    this.groupByColumns.forEach((element: any) => {
      this.displayedColumns.forEach((e: any, index) => {
        if (e == element) {
          this.displayedColumns.splice(index, 1);
        }
      });
    });
  }

  dropTable(event: CdkDragDrop<any>) {
    const prevIndex = this.dataSource.data.findIndex(
      (d) => d === event.item.data
    );
    console.log(prevIndex);

    [this.groupByColumns[prevIndex], this.groupByColumns[event.currentIndex]] =
      [this.groupByColumns[event.currentIndex], this.groupByColumns[prevIndex]];
    this.dataSource.data = this.addGroups(this._allData, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  remove(col: string): void {
    const index = this.groupByColumns.indexOf(col);
    if (index >= 0) {
      this.displayedColumns.push(col);
      this.groupByColumns.splice(index, 1);
      this.dataSource.data = this.addGroups(this._allData, this.groupByColumns);
      this.dataSource.filter = performance.now().toString();
    }
  }

  subClass(level: any) {
    if (level == '2') return 'class2';
    if (level == '3') return 'class3';
    else return 'class1';
  }
}
