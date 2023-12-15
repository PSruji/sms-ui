import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, StudentRequest, StudentTable } from '../model/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient) { 
    
  }
  
  public getStudents(
    pageNumber: Number,
    pageSize: Number
  ): Observable<StudentTable> {
    const url = `http://localhost:8080/students_with_paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return this.http.get<StudentTable>(url);
  }

  public create(std: StudentRequest): Observable<Student>{
    const url='http://localhost:8080/students'
  
    return this.http.post<Student>(url,std)
  }
}
