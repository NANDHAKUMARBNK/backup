import { Component, OnInit, Input } from '@angular/core';
import { BwValidationService } from 'lib-bw-svc-apis/src/lib/bw-validation/bw-validation.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bw-control-error-message',
  templateUrl: './bw-control-error-message.component.html',
  styleUrls: ['./bw-control-error-message.component.scss']
})
export class BwControlErrorMessageComponent implements OnInit {
  @Input() control: any;
  @Input() fieldName: any;
  @Input() customErrorMinLength:any;
  @Input() customErrorReq:any;
  @Input() customErrorPattern:any;
  @Input() customErrormaxLength:any;
  @Input() customErrormax:any;
  @Input() customErrormin:any;



  constructor(
    private validationService: BwValidationService
  ) { }

  ngOnInit(): void {
  }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.validationService.getValidatorErrorMessage(propertyName, this.fieldName, this.control.errors[propertyName],this.customErrorMinLength,this.customErrormaxLength,this.customErrorReq,this.customErrorPattern,this.customErrormax,this.customErrormin);
      }
    }

    return null;
  }

}
