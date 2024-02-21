import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService
  ) { }
  inputID = "";
  inputPassword = "";
  inputOtp = "";
  accessKey: string = "";
  password: string = "s"
  id: string = "s"
  loader: boolean = false;
  loadMessage = 'Logging in...'
  loading: boolean = false;
  islogged: boolean = false;
  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken == '' || accessToken == null) { }
    else {
      this.loading = true
      this.http.get<any>(this.apiservice.url + "apifor=verify&token=" + accessToken).subscribe((res) => {
        if (res.data[0].status === "success") {
          this.router.navigate(['/selectYear']);
          this.loading = false
        }

        else if (res.data[0].status === "invalid") {
          localStorage.removeItem('accessToken');
          this.loading = false
        }

        else {
          alert('server down')
          this.loading = false
        }

      })

    }
  }

  login = () => {

    if (this.inputID === "" || this.inputPassword === "") {
      this.toastr.warning("Please fill correctly !!");
    }

    else {
      this.loader = true
      this.http.get<any>(this.apiservice.url + "apifor=login&loginId=" + this.inputID + "&pass=" + this.inputPassword).subscribe((res) => {
        if (res.data[0].status === "success") {
          this.toastr.success("OTP sent to registered mobile number");
          this.accessKey = res.data[0].token
          localStorage.setItem('accessToken', this.accessKey);
          this.islogged = true;
          this.loader = false
        }

        else if (res.data[0].status === "invalid") {
        this.toastr.error("Password or id is wrong !!");
          this.inputID = "";
          this.inputPassword = "";
          this.loader = false

        }

        else {
          this.toastr.error("server down");
          this.loader = false
        }

      })

    }

  };
  verifyOtp = () => {

    if (this.inputOtp === "") {
      this.toastr.warning("Enter valid OTP");
    }

    else {
      this.loader = true
      this.http.get<any>(this.apiservice.url + "apifor=verifyotp&otp=" + this.inputOtp).subscribe((res) => {
        if (res.data[0].status === "success") {
          this.toastr.success("Login Successfull");
          this.accessKey = res.data[0].token
          localStorage.setItem('accessToken', this.accessKey);
          this.router.navigate(['/selectYear']);
          this.islogged = true;
          this.loader = false
        }

        else if (res.data[0].status === "invalid") {
        this.toastr.error("Password or id is wrong !!");
          this.inputID = "";
          this.inputPassword = "";
          this.loader = false
        }

        else {
          this.toastr.error("server down");
          this.loader = false
        }

      })

    }

  };

}
