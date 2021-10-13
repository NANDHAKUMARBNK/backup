import { Component, OnInit } from '@angular/core';

import english from '../../../assets/languages/english.json';
import tamil from '../../../assets/languages/tamil.json';
import telugu from '../../../assets/languages/telugu.json';
import kannada from '../../../assets/languages/kannada.json';
import malayalam from '../../../assets/languages/malayalam.json';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  languages: string[];
  titleName: string;
  proverb: string;
  redirect: any = true;
  constructor(private router: Router, private titleService: Title) {}
  ngOnInit(): void {
    $(document.body).on('touchmove', this.onScroll);
    $(window).on('scroll', this.onScroll);
    this.languages = ['தமிழ்', 'English', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം'];
    this.titleName = tamil.AppTitle.titleName;
    this.titleService.setTitle(this.titleName);
    this.proverb = tamil.AppTitle.proverb;

    $(document.body).on('touchmove', this.onScroll);
    $(window).on('scroll', this.onScroll);
  }
  
  onScroll(){
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $("header").addClass("active");
    }
    else {
        $("header").removeClass("active");
    }
  }
  redirectToHome() {
    //window.location.href = ''
    this.router.navigate(['']);
  }
  updateChanges(e) {
    let lang = e.target.value;
    if (lang === 'தமிழ்') {
      this.titleName = tamil.AppTitle.titleName;
      this.proverb = tamil.AppTitle.proverb;
      this.titleService.setTitle(this.titleName);
    } else if (lang === 'తెలుగు') {
      this.titleName = telugu.AppTitle.titleName;
      this.proverb = telugu.AppTitle.proverb;
      this.titleService.setTitle(this.titleName);
    } else if (lang === 'English') {
      this.titleName = english.AppTitle.titleName;
      this.proverb = english.AppTitle.proverb;
      this.titleService.setTitle(this.titleName);
    } else if (lang === 'ಕನ್ನಡ') {
      this.titleName = kannada.AppTitle.titleName;
      this.proverb = kannada.AppTitle.proverb;
      this.titleService.setTitle(this.titleName);
    } else if (lang === 'മലയാളം') {
      this.titleName = malayalam.AppTitle.titleName;
      this.proverb = malayalam.AppTitle.proverb;
      this.titleService.setTitle(this.titleName);
    }
  }
}
