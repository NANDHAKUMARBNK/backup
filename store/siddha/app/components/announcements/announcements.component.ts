import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  announcements: any;
  announcementscount: any;
  loader:boolean=false;
  refreshApi:boolean=false;

  constructor(private covidTrackingService: CovidtrackingService) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }

  getAnnouncements() {
    this.loader=true;
    this.refreshApi=false;
    this.covidTrackingService.retrieveAnnouncements().subscribe(
      (response: any) => {
        this.announcements = response.result;
        this.loader=false;
        if (this.announcements) {
          this.announcementscount = this.announcements.length;
        }
      },
      (error) => {
        this.refreshApi=true;
       this.loader=false;
      }
    );
  }

}
