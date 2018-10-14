import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as superagent from 'superagent';

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
  ngOnInit() {
    this.tokenValue = this.cookieService.get('TokenID');
    this.userinfo.name = this.cookieService.get('name');
    this.userinfo.email = this.cookieService.get('email');
  }

    gd_uploadFile(name, contentType, data) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        contentType = contentType || "text/html";
        var metadata = {
            name: name,
            'mimeType': contentType
        };

        var multipartRequestBody =
            delimiter +  'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n';

        //Transfer images as base64 string.
        if (contentType.indexOf('image/') === 0) {
            var pos = data.indexOf('base64,');
            multipartRequestBody += 'Content-Transfer-Encoding: base64\r\n' + '\r\n' +
                data.slice(pos < 0 ? 0 : (pos + 'base64,'.length));
        } else {
            multipartRequestBody +=  + '\r\n' + data;
        }
        multipartRequestBody += close_delim;

        superagent.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart').
        set('Content-Type', 'multipart/form-data;  boundary="' + boundary + '"').
        set('Authorization', 'Bearer ' + this.tokenValue).
        send(multipartRequestBody).
        end(function () {
            console.log(arguments);
        });
    }

  onChange(event: EventTarget) {
      let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
      let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
      let files: FileList = target.files;
      this.file = files[0];
  }

  uploadfile() {
    this.gd_uploadFile(this.file.name, this.file.type, this.file);
  }

}
