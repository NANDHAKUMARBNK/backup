import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  name: any;
  email: any;
  message: any;

  constructor(private covidtracking: CovidtrackingService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  changeName(evt: any) {
    this.name = evt.target.value;
  }
  changeEmail(evt: any) {
    this.email = evt.target.value;
  }
  changeMessage(evt: any) {
    this.message = evt.target.value;
  }
  emailValidation(inputtxt: any) {
    let email_Regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
    if (email_Regex.test(inputtxt)) {
      return true;
    }
    return false;
  }
  // Icons Changing on hover
  imgSrc: string = "../../../assets/images/facebook (1).png";

  onMouseOver(): void {
    this.imgSrc = "../../../assets/images/facebook (2).png";
  }

  onMouseOut(): void {
    this.imgSrc = "../../../assets/images/facebook (1).png";
  }

  //Twitter
  imgSrc1: string = "../../../assets/images/twitter.png";

  onMouseOver1(): void {
    this.imgSrc1 = "../../../assets/images/twitter (1).png";
  }

  onMouseOut1(): void {
    this.imgSrc1 = "../../../assets/images/twitter.png";
  }
//Youtube
imgSrc2: string = "../../../assets/images/youtube.png";

  onMouseOver2(): void {
    this.imgSrc2 = "../../../assets/images/youtube (1).png";
  }

  onMouseOut2(): void {
    this.imgSrc2 = "../../../assets/images/youtube.png";
  }
//Linkedin
imgSrc3: string = "../../../assets/images/linkedin.png";

  onMouseOver3(): void {
    this.imgSrc3 = "../../../assets/images/linkedin (1).png";
  }

  onMouseOut3(): void {
    this.imgSrc3 = "../../../assets/images/linkedin.png";
  }
//Instagram
imgSrc4: string = "../../../assets/images/instagram.png";

  onMouseOver4(): void {
    this.imgSrc4 = "../../../assets/images/instagram (1).png";
  }

  onMouseOut4(): void {
    this.imgSrc4 = "../../../assets/images/instagram.png";
  }

  //  Button Nname
  saveFeedback() {
    let Name = this.name;
    let Email = this.email;
    if (Email) {
      if (!this.emailValidation(Email)) {
        return;
      }
    }
    let Message = this.message;
    if (!Name || !Email || !Message) {
      return;
    }
    else {
      const requestBody = {
        "first_name": Name,
        "message": Message,
        "email": Email
      }
      // saveFeedback from Service file api 
      this.covidtracking.saveFeedback(requestBody).subscribe((Response: any) => {
        let responsefromFeedback = Response.result;
        if (responsefromFeedback) {
          this.name = "";
          this.email = "";
          this.message = "";
          $("#feedbackForm")[0].reset()
          this.toastr.success("Successfully submitted your feedback");
        }
      })
    }
  }
}
