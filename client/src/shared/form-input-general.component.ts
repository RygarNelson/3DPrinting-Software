import { Component, Input } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Component({
  selector: 'app-form-input-general',
  imports: [],
  template: ``
})
export class FormInputGeneralComponent {
  @Input() property: string = '';
  @Input() label: string = '';
  @Input() infoMessage: string | undefined = undefined;
  @Input() disabled: boolean = false;
  @Input() obligatory: boolean = false;
  @Input() placeholder: string = '';


  @Input() listaErrori: ErrorsViewModel[] = [];
  @Input() parent?: string;
  @Input() index?: number;
}
