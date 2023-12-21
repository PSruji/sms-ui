import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../service/student.service';
import { StudentRequest } from '../model/student.model';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  id!: string;
  form!: FormGroup;
  isLoading = false;
  isAddMode = true;
  title = "Create";

  constructor(private fb:FormBuilder, private studentService:StudentService, private route: ActivatedRoute, private router : Router){

  }
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        fname:  ['',Validators.required],
        mname:  [''],
        lname:  ['',Validators.required],
        email:  ['',[Validators.required, Validators.email]],
        phone:  [''],
        dojStr: ['',Validators.required],
        dobStr: ['',Validators.required],
        grade:  ['',Validators.required],

      }
     );
     this.id = this.route.snapshot.params['id'];
     this.isAddMode = !this.id;

     if(!this.isAddMode){
      this.title="Update";
      this.studentService.getById(this.id).pipe(first()).subscribe(res => {
        console.log(res);
        this.form.controls['fname'].setValue(res.fname);
        this.form.controls['mname'].setValue(res.mname);
        this.form.controls['lname'].setValue(res.lname);
        this.form.controls['email'].setValue(res.email);
        this.form.controls['phone'].setValue(res.phone);
        this.form.controls['dobStr'].setValue(res.dob+ "T12:00:00Z");
        this.form.controls['dojStr'].setValue(res.doj+ "T12:00:00Z");
        this.form.controls['grade'].setValue(res.grade+"");
        
      });
    }
    
  }

  onSubmit(): void{
    this.isLoading=true
    const req:StudentRequest={
      id: 0,
      fname: this.form.controls['fname'].value,
      mname: this.form.controls['mname'].value,
      lname: this.form.controls['lname'].value,
      email: this.form.controls['email'].value,
      phone: this.form.controls['phone'].value,
      dobStr: this.formatDate(this.form.controls['dobStr'].value),
      dojStr: this.formatDate(this.form.controls['dojStr'].value),
      grade: this.form.controls['grade'].value,
    }
    console.log(req)
    this.studentService.create(req).pipe(first()).subscribe({
      next:()=>{
        this.isLoading=false
      },
      error:(err:any)=>{ console.log(err); this.isLoading=false}
    })
  }

  formatDate(date: any): string{
    const dt=new Date(date)
    const day=dt.getDate();
    const month=dt.getMonth()+1

    var dayStr=""+day;
    if(day<10)
      dayStr=`0${day}`
      var monthStr=""+month;
      if(month<10)
        monthStr=`0${month}`
      
      const year=dt.getFullYear();
      return `${year}-${monthStr}-${dayStr}`
    }

    home(){
      this.router.navigate(['/home']);
    }

}
