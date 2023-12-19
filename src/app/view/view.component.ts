import { Component, OnInit } from '@angular/core';
import { Student } from '../model/student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../service/student.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  id!: string;

  std!: Student;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.studentService.getById(this.id).pipe(first()).subscribe(res => this.std = res);
    
  }
  
  constructor(public studentService: StudentService, private route: ActivatedRoute, private router : Router) { }



}
