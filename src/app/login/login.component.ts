import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';

declare const gapi: any;
declare let $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public auth2: any = {};
  socialuserinformation = {tokenid: '', id: '', name: '', imageurl: '', email: '', usertype: ''};

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  ngOnInit() {
  }

  // **Google Sign In method**
  public googleInit() {
    gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
            client_id: 'ADD_YOUR_CLIENT_ID_HERE',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
        });
        this.attachSignin(document.getElementById('googleBtn'));
        this.attachSignin(document.getElementById('googleBtnmobile'));
    });
  }

public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
            let profile = googleUser.getBasicProfile();

            this.socialuserinformation.tokenid = googleUser.getAuthResponse().id_token;
            this.socialuserinformation.id = profile.getId();
            this.socialuserinformation.name = profile.getName();
            this.socialuserinformation.imageurl = profile.getImageUrl();
            this.socialuserinformation.email = profile.getEmail();
            this.socialuserinformation.usertype = 'google';
            
            this.cookieService.set('TokenID', this.socialuserinformation.tokenid);
            this.cookieService.set('name', this.socialuserinformation.name);
            this.cookieService.set('email', this.socialuserinformation.email);
            this.router.navigate(['/profile']);

        }, (error) => {
            console.log(error);
        });
}

ngAfterViewInit() {
    this.googleInit();
}

}
