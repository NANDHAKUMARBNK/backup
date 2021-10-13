import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'lib-bw-svc-apis/src/lib/home/home.service';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit {
  securityForm: FormGroup;
  SecurityQA: any;
  questionAnswerSame = false;
  sqaSucess = false;
  questionAnswernotPart = false;
  newUser = false;
  isError = false;
  errMessage: any = [];
  lists =[
   "Your security answer must be at least 8 characters long.",
   "The security answer cannot be part of the security question",
   "The question and answer can't be the same."
  ]

  constructor(private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.securityForm = this.fb.group({
      question: ['', [Validators.required]],
      //  answer: ['', [Validators.required]],
      answer: ['', [Validators.required, Validators.minLength(8)]]


    })
  }

  ngOnInit(): void {
    const user = this.storageService.getData('user') && JSON.parse(this.storageService.getData('user'));
    if (!user.account.hasSecurityQuestionAnswer) {
      this.newUser = true;
    }
    this.getSecurityQA();
  }

  getSecurityQA() {
    this.homeService.getSecurityQuestion().subscribe((data: any) => {
      this.SecurityQA = data.result;
      this.securityForm.patchValue(data.result)
    })
  };


  seterror(err: any) {
    console.log(err, 'errrr');
    // this.securityForm.controls.question.setErrors({customError: 'Your phone must be at least 5 characters long.'});
    // this.securityForm.controls.question.setErrors({required: 'Your phone must be at least 5 characters long.'})

  }

  cancelClick(event: any) {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute })
  }


  changeQuestion(event: any) {
    let question = this.securityForm.get('question') ?.value;
    let answer = this.securityForm.get('answer') ?.value;

    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      if (question == answer) {
        this.questionAnswerSame = true;
        return
      } else {
        this.questionAnswerSame = false;
      }
      if (question.indexOf(answer) != -1) {
        this.questionAnswernotPart = true;
        return
      } else {
        this.questionAnswernotPart = false;

      }
      return
    }
    if (question == answer) {
      this.questionAnswerSame = true;
      if (question.indexOf(answer) != -1) {
        this.questionAnswernotPart = true;
        return
      } else {
        this.questionAnswernotPart = false;
      }
      return
    } else {
      this.questionAnswerSame = false;
    }

    if (question == answer) {
      this.questionAnswerSame = true;
      return

    } else {
      this.questionAnswerSame = false;

    }
    if (question.indexOf(answer) != -1) {
      this.questionAnswernotPart = true;
      return
    } else {
      this.questionAnswernotPart = false;
    }

    this.homeService.changeSecurityQuestion(this.securityForm.value).subscribe((data: any) => {
      this.sqaSucess = true;
      let user = this.storageService.getData('user') && JSON.parse(this.storageService.getData('user'));
      if (!user.account.hasSecurityQuestionAnswer) {
        user.account['hasSecurityQuestionAnswer'] = true;
        this.storageService.setData('user', JSON.stringify(user));
        this.newUser = false;
      }
    },
      err => {
        this.sqaSucess = false;
        this.setError(err.error.result.errorMessages);
      }
    )
  }


  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

}
