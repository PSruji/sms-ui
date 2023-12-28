import { Component, OnInit, ViewChild } from '@angular/core';
import { Student, StudentTable } from '../model/student.model';
import { StudentService } from '../service/student.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { first } from 'rxjs';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

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


  
  constructor(public studentService: StudentService,private route: ActivatedRoute,private router : Router, public dialog:MatDialog, private _snackBar: MatSnackBar) { }
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
    this.router.navigate([`/edit/${id}`]);

  }

  deleteStudent(id: any){
    console.log(`delete called for student id: ${id}`);
    //let v = window.confirm("Do you want to Student with ID# "+id);
    //console.log(v);.

    const dialogRef = this.dialog.open(DeleteDialogComponent, {data: id, width:"500px"});
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
     if(result){

      this.studentService.deleteStudent(id).pipe(first()).subscribe({
        next:(res : Student)=>{
          this.isLoading=false
          this.loadData()
          this.openSnackBar(`Student Successfully Deleted with ID# ${res.id}`);
          //this.view(res.id);
        },
        error:(err:any)=>{ console.log(err); this.isLoading=false}
      })
     }else{

     }

    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
