import { Component, OnInit, ViewChild } from '@angular/core';
import { Student, StudentTable } from '../model/student.model';
import { StudentService } from '../service/student.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  dataSource = new MatTableDataSource<Student>();

  displayedColumns: string[] = [
    'id',
    'fname',
    'lname',
    'actions'
  ];

  stuTable!: StudentTable;

  totalData!: number;
  stuData!: Student[];


  isLoading = false;
  @ViewChild('paginator')
  paginator!: MatPaginator;

  pageSizes = [3, 5, 7];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;


  
  constructor(public studentService: StudentService,private route: ActivatedRoute,private router : Router) { }
ngOnInit(): void {
    this.loadData();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
getTableData$(pageNumber: Number, pageSize: Number) {
    return this.studentService.getStudents(pageNumber, pageSize);
  }

  public executeSelectedChange = (event: any) => {
    console.log(event);
  }
  loadData() {
    this.isLoading = true;
    let URL = `http://localhost:8080/students_with_paginated?pageNumber=${this.currentPage}&pageSize=${this.pageSize}`;


    fetch(URL)
      .then(response => response.json())
      .then(data => {
        this.dataSource.data = data.content;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.totalElements;
        });
        this.isLoading = false;
}, error => {
        console.log(error);
        this.isLoading = false;
      });
  }
pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  view(id: any){
    console.log(`view details called for student id: ${id}`);
    this.router.navigate([`/view/${id}`]);
  }

  edit(id: any){
    console.log(`Edit details called for student id: ${id}`);
  }

  delete(id: any){
    console.log(`Delete details called for student id: ${id}`);
  }

}
