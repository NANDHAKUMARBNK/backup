import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.redirect();
    this.modelDialog();
  }
  modelDialog() {
    $('#exampleModalCenter').modal('show');
  };
  close(){
    $('#exampleModalCenter').modal('hide');
    this.router.navigate(['']);
  }

  redirect() {
    setTimeout(() => {
      $('#exampleModalCenter').modal('hide');
      this.router.navigate(['']);
    }, 9000);
  }
}