import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

declare const gapi: any;
declare const request: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  userinfo = {name: '', email: ''};
  tokenValue = '';
  file: File;
  fileToUpload: File = null;
  ngOnInit() {
    this.tokenValue = this.cookieService.get('TokenID');
    this.userinfo.name = this.cookieService.get('name');
    this.userinfo.email = this.cookieService.get('email');
  }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    upload() {

        let fileContent = this.fileToUpload;

        let file = new Blob([fileContent], { type: this.fileToUpload.type });
        let metadata = {
            'name': this.fileToUpload.name,
            'mimeType': this.fileToUpload.type,
            'parents': ['FILE_ID'],
        };

        let accessToken = this.tokenValue;
        let form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        let xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';

        xhr.onload = () => {
            alert('File Uploaded');
            console.log(xhr.response);
        };
        xhr.send(form);
    }

}
