import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";

@Component({
  selector: "bw-toastr",
  templateUrl: "./toastr.component.html",
  styleUrls: ["./toastr.component.scss"],
})
export class ToastrComponent implements OnInit {
  @ViewChild("template", { read: TemplateRef })
  public notificationTemplate!: TemplateRef<any>;
  @Input() type: any;
  @Input() buttonText: any;
  @Input() message: any;
  @Input() position: any;
  @Input() showToastrOnClick: any = false;
  @Input() rowClass: any;
  @Input() width: any = "100%";
  @Input() isIcon: any = true;
  @Output() click = new EventEmitter();
  @Input() isListOrder: any;
  @Input() lists: any;
  @Input() iconColClass: any = "1";
  @Input() textColClass: any = "11";
  @Input() alert: any = "alert";
  @Input() isLinkText: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (!this.showToastrOnClick) {
      // this.showToastr(this.type);
    }
    if (!this.isIcon) {
      this.textColClass = "12";
    }
  }

  public showToastr(type?: any): void {
    // this.toastrMessage(type);
  }

  toastrMessage(type?: any) {
    return this.notificationService.show({
      content: this.notificationTemplate || this.message,
      hideAfter: !this.showToastrOnClick ? 900000 : 600,
      position: { horizontal: "center", vertical: "top" },
      animation: { type: "fade", duration: 400 },
      type: { style: type, icon: true },
    });
  }
}
