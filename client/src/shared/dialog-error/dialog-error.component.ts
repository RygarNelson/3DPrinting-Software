import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-dialog-error',
  imports: [
    CommonModule,
    DialogModule,
    InputIconModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './dialog-error.component.html',
  styleUrl: './dialog-error.component.scss'
})
export class DialogErrorComponent {
  @Input() error: any;

  constructor(private ref: DynamicDialogRef) {}

  closeDialog() {
    this.ref.close();
}
}
