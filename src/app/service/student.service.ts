import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student, StudentRequest, StudentTable } from '../model/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  BASE_URL= "http://localhost:8080";

  constructor(private http:HttpClient) { 
    
  }
  
  public getStudents(
    pageNumber: Number,
    pageSize: Number
  ): Observable<StudentTable> {
    const url = `${this.BASE_URL}/students_with_paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return this.http.get<StudentTable>(url);
  }

  public create(std: StudentRequest): Observable<Student>{
    const url='${this.BASE_URL}/students'
  
    return this.http.post<Student>(url,std)
  }

  public getById(id:String): Observable<Student> {
    const url = `${this.BASE_URL}/students/${id}`;
    return this.http.get<Student>(url);
  }

}
