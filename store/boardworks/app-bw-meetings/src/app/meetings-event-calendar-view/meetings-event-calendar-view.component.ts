import { MeetingsService } from "./../../../../lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { Component, Input, OnChanges } from "@angular/core";
import { sampleData, displayDate } from "./event.utc";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { MONTHS } from "lib-bw-svc-apis/src/lib/constant/meetingEventsConstant";
import { ActivatedRoute, Router } from "@angular/router";
import { newArray } from "@angular/compiler/src/util";
interface CustomSchedulerEvent extends SchedulerEvent {
  status?: any;
  type?: string;
  onlineMeetingUrl?: string;
  events?: any;
  startTime?: any;
  endTime?: any;
}
@Component({
  selector: "app-meetings-event-calendar-view",
  templateUrl: "./meetings-event-calendar-view.component.html",
  styleUrls: ["./meetings-event-calendar-view.component.scss"],
})
export class MeetingsEventCalendarViewComponent implements OnChanges {
  public selectedDate: Date = new Date();
  public events: CustomSchedulerEvent[] = sampleData;
  public monthlyEvents : CustomSchedulerEvent[] = [];
  // events: any;
  @Input() filteredData: any;
  @Input() viewType: any = "1month";
  list: any = [];
  openCalendar: any = false;
  displayDate: any;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  fourMonthCalendar: any = [1, 2, 3, 4];
  displayedMonths: any = [];

  constructor(
    private meetingService: MeetingsService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnChanges(): void {
    this.getMeetings();
    this.get4MonthsDetails();
  }

  getMeetings() {
    const data = {
      dateStart:
        this.filteredData.dateStart !== "" ? this.filteredData.dateStart : null,
      dateEnd:
        this.filteredData.dateEnd !== "" ? this.filteredData.dateEnd : null,
      commiteeIds:
        this.filteredData.commiteeIds !== ""
          ? this.filteredData.commiteeIds
          : [],
      types: this.filteredData.types !== "" ? [this.filteredData.types] : [],
      statuses:
        this.filteredData.statuses !== "" ? this.filteredData.statuses : [],
      timeZoneId: this.filteredData.timeZoneId,
    };
    this.events = [];
    this.monthlyEvents = [];
    this.meetingService.getMeetingsList(data).subscribe((res) => {
      const eventsMap: any = [];
      if(this.viewType == '1month'){
        this.initMonthData(res.result);
      }else{
      this.initData(res.result);
      }
    });
  }

  get4MonthsDetails(month?: any, year?: any) {
    this.list = [];
    this.displayedMonths = [];
    this.fourMonthCalendar.filter((cal: any) => {
      MONTHS.map((item: any) => {
        let monthNumber: any =
          (month || (month === 0 ? month : this.currentMonth)) + cal;
        monthNumber = monthNumber > 12 ? monthNumber - 12 : monthNumber;
        if (item.value == monthNumber) {
          this.displayedMonths.push(item.name);
        }
      });
      this.list.push({
        selectedDate: new Date(
          year || this.currentYear,
          (month || (month === 0 ? month : this.currentMonth)) + cal - 1,
          1
        ),
      });
    });

    this.filteredData.dateStart = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    this.filteredData.dateEnd = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 5, 0);
    this.getMeetings();
  }

  get1MonthDetails(month?: any, year?: any) {
    this.selectedDate = new Date(
      year || this.currentYear,
      month || (month === 0 ? month : this.currentMonth),
      1
    );

    this.filteredData.dateStart = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    this.filteredData.dateEnd = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
    this.getMeetings();

  }

  parseAdjust(eventDate: string): Date {
    const currentYear = new Date().getFullYear();
    const date = new Date(eventDate);
    date.setFullYear(currentYear);
    return date;
  }

  onClickLink(e: any, type?: any) {
    if (type == "calendar") {
      this.openCalendar = !this.openCalendar;
    }
  }

  onChange4MonthsDate(e: any) {
    this.openCalendar = false;
    const date = new Date(e);
    this.get4MonthsDetails(date.getMonth(), date.getFullYear());
  }

  onChange4MonthsDateBy(count: any) {
    this.openCalendar = false;
    const date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + count));
    this.get4MonthsDetails(date.getMonth(), date.getFullYear());
  }

  onChange1MonthDate(e: any) {
    this.openCalendar = false;
    const date = new Date(e);
    this.get1MonthDetails(date.getMonth(), date.getFullYear());
  }

  onChange1MonthDateBy(count: any) {
    this.openCalendar = false;
    const date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + count));
    this.get1MonthDetails(date.getMonth(), date.getFullYear());
  }

  getYear(date: any) {
    return new Date(date).getFullYear();
  }

  initData(data: any) {
    
    //TODO  WE need to break different event with same day start and stop date.
    //TODO  We need to merge the array of same start and end day

    let days: CustomSchedulerEvent[] = [];
    data.forEach((me: any) => {
      me &&
        me.meetingsEvents &&
        me.meetingsEvents.length &&
        me.meetingsEvents.forEach((dataItem: any) => {
          for (
            var d = new Date(dataItem.startDate);
            d <= new Date(dataItem.endDate);
            d.setDate(d.getDate() + 1)
          ) {
            days.push(<CustomSchedulerEvent>{
              id: dataItem.meetingId,
              start: new Date(d),
              startTimezone: dataItem.timeZone || "",
              end: new Date(d),
              endTimezone: dataItem.endTimezone || null,
              isAllDay: dataItem.isAllDayEvent || null,
              title: "1",
              description: dataItem.committeeName || "",
              recurrenceRule: dataItem.RecurrenceRule || "",
              recurrenceId: dataItem.RecurrenceID || null,
              recurrenceException: dataItem.RecurrenceException || null,
              status: dataItem.status || null,
              type: dataItem.type || null,
              onlineMeetingUrl: dataItem.onlineMeetingUrl || null,
              events: [dataItem],
              startTime: dataItem.startDateTime,
              endTime: dataItem.endDateTime,

              // roomId: dataItem.RoomID || '',
              // ownerID: dataItem.OwnerID ||
            });
          }
        });
    });
    this.groupByDate(days)
  }

initMonthData(data:any){ 
  let events: CustomSchedulerEvent[] = [];
  data.forEach((me: any) => {
    me &&
      me.meetingsEvents &&
      me.meetingsEvents.length &&
      me.meetingsEvents.forEach((dataItem: any) => {
     
        events.push(<CustomSchedulerEvent>{
            id: dataItem.meetingId,
            start: this.parseAdjust(dataItem.startDate),
            startTimezone: dataItem.timeZone || "",
            end:  this.parseAdjust(dataItem.endDate),
            endTimezone: dataItem.endTimezone || null,
            isAllDay: dataItem.isAllDayEvent || null,
            title: dataItem.title,
            description: dataItem.committeeName || "",
            recurrenceRule: dataItem.RecurrenceRule || "",
            recurrenceId: dataItem.RecurrenceID || null,
            recurrenceException: dataItem.RecurrenceException || null,
            status: dataItem.status || null,
            type: dataItem.type || null,
            onlineMeetingUrl: dataItem.onlineMeetingUrl || null,
            startTime: dataItem.startDateTime,
            endTime: dataItem.endDateTime,
          });

      });

    });
    this.monthlyEvents = events;
}

  groupByDate(data: any) {
    // data.reduce((results: any, item: any) => {
       const data1:any = [];
      data.forEach((item:any) => {
        const current = data1.find(
          (i: any) =>
            new Date(i.start).getDate() === new Date(item.start).getDate()
        );
        // console.log("cerrent", current);
        if (current && item.events[0]) {
          // console.log(current);
          current.title = (parseInt(current.title) + 1).toString();
          current["events"].push(item.events[0]);
        } else {
          data1.push({ ...item });
        }
        // return results;
      });
      this.events = data1;
  
    // }, []);
  }

  mapEvent(start: any) {
    return this.events.find(
      (i: any) => new Date(i.start).getDate() === new Date(start).getDate()
    )?.events;
  }

  onClickMELink(event: any) {
    // console.log(event);
    if (event && event.type && event.type == "Meeting" || (event && event.dataItem && event.dataItem.type == "Meeting" )) {
      this.route.navigate(
        [`meeting-details`, { type: "view", id: event.meetingId || event.id}],
        { relativeTo: this.activatedRoute }
      );
    } else if (event && event.type && event.type == "Event" ||(event && event.dataItem && event.dataItem.type == "Event" )) {
      this.route.navigate(
        [`event-details`, { type: "view", id: event.meetingId || event.id  }],
        { relativeTo: this.activatedRoute }
      );
    }
  }

  mapEventStatus(id:any){
    return this.monthlyEvents.find(x=>x.id == id)?.status;
  }
  
  mapEventType(id:any){
    return this.monthlyEvents.find(x=>x.id == id)?.type;
  }
}
