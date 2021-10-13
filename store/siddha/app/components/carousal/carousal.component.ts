import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-carousal',
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.css'],
})
export class CarousalComponent implements OnInit {
  Videos: any;
  Official: any;
  Celebrity: any;
  Public: any;
  Url: any;
  OfficialUrl: any;
  CelebrityUrl: any;
  PublicUrl: any;
  urlSafeOfficial: any;
  urlSafeCelebrity: any;
  urlSafePublicUrl: any;
  iframeLoaderOfficial: boolean = false;
  refreshApi: boolean = false;
  iframeLoaderCelebrity: boolean = false;
  iframeLoaderPublic: boolean = false;



  constructor(private covidTrackingService: CovidtrackingService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getCatagoryVideos();
  }
  iframeloadedOfficial() {
    this.iframeLoaderOfficial = false;
  };
  iframeloadedCelebrity() {
    this.iframeLoaderCelebrity = false;
  };
  iframeloadedPublic() {
    this.iframeLoaderPublic = false;
  };

  getCatagoryVideos() {
    this.iframeLoaderOfficial = true;
    this.covidTrackingService.getVideos().subscribe((resp: any) => {
      this.Videos = resp.result;
      this.refreshApi = false;
      let filterBasedOnCatagoryOfficial = this.Videos.filter(
        (item) => item.category_id === 1
      );
      this.Official = filterBasedOnCatagoryOfficial;
      if (this.Official) {
        this.Official.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
        let tempArr: any = [];
        this.Official.map((link: any) => {
          let videoId = link.link.substring(30);
          // let start = link.link.substring(48);
          // let startValue = start.slice(0, 3);
          // let end = link.link.substring(60);
          // let endValue = end.slice(0, 3);
          tempArr.push(videoId);
        });
        this.iframeLoaderOfficial = true
        //https://www.youtube.com/embed/bL2CTzSM6Mw
        //Home Page: Video Carousel - Main Video (Link: https://www.youtube.com/embed/yxmoo5ixoR0?start=513&amp;end=582)
        this.OfficialUrl = `https://www.youtube.com/embed?loop=1&playlist=${tempArr}`;
        var elms = document.getElementById("officalFrame");
        elms.setAttribute("src", this.OfficialUrl);


        // this.OfficialUrl = `https://www.youtube.com/embed/${tempArr[0]}?loop=1&playlist=${tempArr}`;
      }
      let filterBasedOnCatagoryCelebrity = this.Videos.filter(
        (item) => item.category_id === 2
      );
      this.Celebrity = filterBasedOnCatagoryCelebrity;
      if (this.Celebrity) {
        this.Celebrity.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
        let tempArr: any = [];
        this.Celebrity.map((link: any) => {
          let videoId = link.link.substring(30);
          tempArr.push(videoId);
        });
        this.iframeLoaderCelebrity = true

        this.CelebrityUrl = `https://www.youtube.com/embed?loop=1&playlist=${tempArr}`;
        let celebrityUrl = document.getElementById("celebrityFrame");
        celebrityUrl.setAttribute("src", this.CelebrityUrl);

      }
      let filterBasedOnCatagoryPublic = this.Videos.filter(
        (item) => item.category_id === 3
      );
      this.Public = filterBasedOnCatagoryPublic;
      if (this.Public) {
        this.Public.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
        let tempArr: any = [];
        this.Public.map((link: any) => {
          let videoId = link.link.substring(30);
          tempArr.push(videoId);
        });
        this.iframeLoaderPublic = true

        this.PublicUrl = `https://www.youtube.com/embed?loop=1&playlist=${tempArr}`;
        let publicUrl = document.getElementById("publicFrame");
        publicUrl.setAttribute("src", this.PublicUrl);

      }
    },
      error => {
        this.iframeLoaderOfficial = false;
        this.iframeLoaderCelebrity = false;
        this.iframeLoaderPublic = false;
        this.refreshApi = true;
      }
    );
  }
}
