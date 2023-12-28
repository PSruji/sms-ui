import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../service/student.service';
import { Student, StudentRequest } from '../model/student.model';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  id!: number;
  form!: FormGroup;
  isLoading = false;
  isAddMode = true;
  title = "Create";

  constructor(private fb:FormBuilder, private studentService:StudentService, private route: ActivatedRoute, private router : Router, private _snackBar: MatSnackBar){

  }
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        fname:  ['',[Validators.required, Validators.minLength, Validators.maxLength]],
        mname:  ['', Validators.maxLength],
        lname:  ['',[Validators.required, Validators.minLength, Validators.maxLength]],
        email:  ['',[Validators.required, Validators.email, Validators.maxLength ]],
        phone:  ['', Validators.maxLength],
        dojStr: ['',[Validators.required,Validators.min]],
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

  createStudent( req: StudentRequest) : void{
   
   
    console.log(req)
    this.studentService.create(req).pipe(first()).subscribe({
      next:(res : Student)=>{
        this.isLoading=false
        this.openSnackBar(`Student Created Successfullywith ID# ${res.id}`);
        this.view(res.id);
      },
      error:(err:any)=>{ console.log(err); this.isLoading=false}
    })

  }

  updateStudent( req: StudentRequest): void{

    this.studentService.update(this.id, req).pipe(first()).subscribe({
      next:(res: Student)=>{
        this.isLoading=false
       this.openSnackBar(`Student Updated Successfullywith ID# ${res.id}`);
        this.view(res.id);
      },
      error:(err:any)=>{ console.log(err); this.isLoading=false}
    })
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
    if(this.isAddMode){
      this.createStudent(req);
    }else{
      req.id = this.id;
      this.updateStudent(req);
    }
      
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

    view(id: number){
      this.router.navigate([`/view/${id}`]);
    }

    openSnackBar(message: string) {
      this._snackBar.open(message, 'Ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
}
