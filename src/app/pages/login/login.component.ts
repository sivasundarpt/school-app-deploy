import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginfo = {
    name: '',
    password: '',
    registrationId: '',
    DOB:''
  };
  bsConfig: Partial<BsDatepickerConfig>;


  //   const sign_in_btn = document.querySelector("#sign-in-btn");
  // const sign_up_btn = document.querySelector("#sign-up-btn");
  // const container = document.querySelector(".container");

  // sign_up_btn.addEventListener("click", () => {
  //   container.classList.add("sign-up-mode");
  // });

  // sign_in_btn.addEventListener("click", () => {
  //   container.classList.remove("sign-up-mode");
  // });

  showStudentLogin = false;

  constructor(private route: Router) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-dark-blue" });
   }

  ngOnInit(): void {
  }

  login() {
    console.log('this.loginfo', this.loginfo)
    localStorage.setItem('loginInfo', JSON.stringify(this.loginfo));
    this.route.navigate(['/dashboard']);
  }

}
