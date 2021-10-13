import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  providers: [MessageService]
})
export class ToasterComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}
  onSucess() {
    this.messageService.add({
      key: 'c',
      severity: 'success',
      summary: 'Successfully Saved',
      life: 8000
    });
  }
}
