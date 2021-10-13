import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bw-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  @Input() cards: any;
  @Input() width = "100%";
  @Output() cardClick: EventEmitter<any> = new EventEmitter();
  @Output() cardFooterClick: EventEmitter<any> = new EventEmitter();
  @Input() isEnableIcons: any;
  @Input() className: any;
  @Input() cardBodyClassName: any;
  settingIcon: any = "assets/images/settings.png";
  flagIcon: any = "assets/images/flag.png";
  @Input() padding: any = "15";
  @Input() classBorderName: any = "card-border";
  @Input() classheaderName: any = "forHeader";
  @Input() classfooterName: any = "forFooter";
  @Input() cardClass: any = "";
  @Input() isRecentUpdates: boolean = false;
  @Output() clickRecentUpdates: EventEmitter<any> = new EventEmitter();
  isSettings: boolean = false;
  constructor() {}
  ngOnInit(): void {
    console.log(this.cardBodyClassName, "cardBodyClassName");

    if (this.className) {
      this.className = `card ${this.className}`;
    }
  }
  onClickCard(card: any) {
    this.cardClick.emit(card);
  }
  onClickUpdates(params: any) {
    this.clickRecentUpdates.emit(params);
  }
  cardFooter(e: any) {
    this.cardFooterClick.emit(e);
  }
  settings(e: any) {
    this.isSettings = true;
  }
  closeSettings(e: any) {
    if (e === "close") {
      this.isSettings = false;
    }
  }
}
