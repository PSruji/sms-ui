import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent  implements OnInit{

  @Output() public sidenavToggle = new EventEmitter();
  
  ngOnInit(): void {
    
  }

  constructor() {}

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
