import { Injectable } from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";

@Injectable({
  providedIn: "root",
})
export class ToastrService {
  constructor(private notificationService: NotificationService) {}

  showToastr(type?: any, message?: any) {
    return this.notificationService.show({
      content: message,
      hideAfter: 3000,
      position: { horizontal: "center", vertical: "top" },
      animation: { type: "fade", duration: 400 },
      type: { style: type, icon: true },
    });
  }
}
