import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Covid } from '../../model/covid';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MessageBoxButton, MessageBox } from 'src/app/shared/message-box';

@Component({
  selector: 'app-covid-list',
  templateUrl: './covid-list.component.html',
  styles: []
})
export class CovidListComponent implements OnInit {

  constructor(
    private service: PatientService,
    private router: Router,
    private dialog: MatDialog) {
  }

  public dialogConfig;
  public displayedColumns = ['country', 'cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'active'];
  public dataSource = new MatTableDataSource<Covid>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pageIndex = 0;
  totalLength: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    }

    this.getCovidList();
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageChange(event: any) {
    /*this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize
    this.createTable();*/
  }

  public getCovidList() {
    
    this.service.covidData().subscribe(
      response => {
        this.dataSource.data = response;
        
      },
      error => {
          console.log(error);
      }
    );
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

}