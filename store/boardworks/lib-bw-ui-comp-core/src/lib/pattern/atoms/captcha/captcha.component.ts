import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
declare var grecaptcha: any;

@Component({
  selector: 'bw-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() control: any;
  @Input() customErrorReq: any;
  @Input() customErrorPattern: any;
  @Input() errorMessageName: any;

  @Output() checked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id) {
      this.getCaptcha();
    }
  }

  verifyCallback(e: any) {
    this.control.setValue(e);
  }

  getCaptcha() {
    grecaptcha.ready(() => {
      grecaptcha.render(this.id, {
        'sitekey': environment.RECAPTCHA_PUBLIC_KEY,
        'callback': (e: any) => this.verifyCallback(e),
      });
    });

  }

}
