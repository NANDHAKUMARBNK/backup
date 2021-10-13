import { Component, OnInit, ViewEncapsulation, ɵConsole } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import staticPage from '../../../assets/staticPage.json';
import Moment from 'moment';


import { Router } from '@angular/router';
// import Moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-home-v1',
  templateUrl: './home-v1.component.html',
  styleUrls: ['./home-v1.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Window, useValue: window }],
})
export class HomeV1Component implements OnInit {

  announcements: [];
  districts: [];
  doctorLocationFilter: any;
  doctorsCount: any;
  DataDoctor: any;
  popupShow: any = false;
  districtArray: any;
  wardsValue: any;
  villageValue: any;
  flyText: any;
  flytextTitle: any;
  flytextDescription: any;
  htmlContent: any;
  announcementscount: number;
  protectiveMeasures: any;
  functionalFood: any;
  stageOne: any;
  stageTwo: any;
  stageThree: any;
  staticData: any;
  constructor(
    private covidTrackingService: CovidtrackingService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.staticData = staticPage;
    this.getDistricts();
    this.getStaticContent();
    this.getColorCodeBars();
    // if (!localStorage.hasOwnProperty('showpopup')) {
    //   localStorage.setItem('showpopup', '');
    //   this.modelDialog();
    // }
  }

  modelDialog() {
    $('#exampleModalLong').modal('show');
  };

  redirecttoVideo() {
    this.router.navigate(['/uploadvideo']);
  };


  stageOneClick(url) {
    //  window.location.href=url.link
    if (url.link)
      window.open(url.link, '_blank');
  };
  stageTwoClick(url){
    if (url.link)
      window.open(url.link, '_blank');
  }
  stageThreeClick(url){
    if (url.link)
      window.open(url.link, '_blank');
  }

  getDistricts() {
    this.covidTrackingService
      .retrieveDistrictsBasedOnPopulationDescSort()
      .subscribe(
        (response: any) => {
          this.districts = response.result;
          if (this.districts) {
            this.getDoctorsFilterByLocation();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getStaticContent() {
    this.covidTrackingService.retrieveStaticContentFlyText().subscribe(
      (response: any) => {
        this.flyText = response.result;
        if (this.flyText) {
          let Title = this.flyText.filter(
            (flyTitle: any) =>
              flyTitle.key === 'flytexttitle' && flyTitle.type === 'text'
          );
          this.flytextTitle = Title;
          let Description = this.flyText.filter(
            (flyDescription: any) =>
              flyDescription.key === 'flytext' && flyDescription.type === 'text'
          );
          this.flytextDescription = Description;
          let htmlText = this.flyText.filter(
            (html: any) => html.key === 'flytext' && html.type === 'html'
          );
          this.htmlContent = htmlText;
          let ArrayUpdatedDate: any = [];

          this.flyText.forEach((Element: any) => {
            if (Element.updated_at) {
              ArrayUpdatedDate.push(Element.updated_at);
            }
          });
          function getMaximumUpdatedDate(tempArray: any, filler: any) {
            filler = filler ? filler : '';
            if (!tempArray.length) {
              return filler;
            }
            let maxTemp = '';
            tempArray.forEach(function (date: any) {
              if (date) {
                let d: any = new Date(date);
                if (maxTemp && d.valueOf() > maxTemp.valueOf()) {
                  maxTemp = d;
                } else if (!maxTemp) {
                  maxTemp = d;
                }
              }
            });
            return maxTemp;
          }
          let maxDate: any = getMaximumUpdatedDate(ArrayUpdatedDate, '');
          let getOne: any = localStorage.getItem('UpdatedDateTime');
          if (!getOne || Moment(getOne) < maxDate) {
            let formatDate: any = Moment(maxDate).format();
            localStorage.setItem('UpdatedDateTime', formatDate);
            this.modelDialog();
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  getDoctorsFilterByLocation() {
    this.covidTrackingService
      .retrieveDoctorFilterByLocation()
      .subscribe((response: any) => {
        this.doctorLocationFilter = response.result;
        let array1 = this.districts;
        let array2 = this.doctorLocationFilter;
        array1.forEach((obj: any) => {
          const a1Ref = obj.id;
          const arr2Obj = array2.find((tmp) => tmp.location[0].id === a1Ref);
          if (arr2Obj) {
            obj.doctors = arr2Obj.count;
            obj.colorcode = 'Red';

            let population = obj.population;
            if (population / obj.doctors != undefined) {
              let codevalue = population / obj.doctors;
              if (codevalue >= 0 && codevalue <= 350) {
                obj.colorcode = 'Green';
              } else if (codevalue >= 351 && codevalue <= 750) {
                obj.colorcode = 'Yellow';
              } else if (codevalue >= 751 && codevalue <= 1100) {
                obj.colorcode = 'Orange';
              }
            }
          }
        });
        this.districts = array1;
      });
  }

  doctorForm() {
    this.router.navigate(['/register']);
  }
  navigateTop(){
    window.scroll(0, 0);
  }
  getColorVal(e) {
    if (e.colorcode) {
      return e.colorcode;
    } else return 'red';
  }


  getColorCodeBars() {
    this.covidTrackingService.getColorCodedBars().subscribe((data: any) => {
      data.result.forEach((item) => {
        item.review_params.forEach((element) => {
          if (element.name === 'Satisfied') {
            element.bgColor = '#6dd400'
          }
          if (element.name === 'Unsatisfied') {
            element.bgColor = '#f7b500'
          }
          if (element.name === "Don't Care") {
            element.bgColor = '#fa6400'
          }
        })
      });

      this.protectiveMeasures = data.result.filter((item) => item.health_types.name === 'Preventive Measures');
      this.functionalFood = data.result.filter((item) => item.health_types.name === 'Functional Foods');
      this.stageOne = data.result.filter((item) => item.health_types.name === 'Stage-1');
      this.stageTwo = data.result.filter((item) => item.health_types.name === 'Stage-2');
      this.stageThree = data.result.filter((item) => item.health_types.name === 'Stage-3');
    },
      error => {

      }
    )
  }
}
