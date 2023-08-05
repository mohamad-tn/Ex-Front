import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statement',
  template: `
  <router-outlet></router-outlet>
  `
})
export class StatementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
