import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobile-card-item',
  imports: [],
  templateUrl: './mobile-card-item.component.html',
  styleUrl: './mobile-card-item.component.scss'
})
export class MobileCardItemComponent {
  @Input() label: string = '';
  @Input() value: any = null;
  @Input() valueClass: string = '';
  @Input() icon: string = '';
}
