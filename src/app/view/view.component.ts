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

  home(){
    this.router.navigate(['/home']);
  }

  edit(){
    this.router.navigate([`/edit/${this.id}`]);
  }
formatGrade(grade:number){
  if(grade==1){
    return "1st Grade";
  }else if(grade == 2){
    return "2nd Grade";
  }else if(grade==3){
    return "3rd Grade";
  }else{
    return `${grade}th Grade`;
  }
}


}
