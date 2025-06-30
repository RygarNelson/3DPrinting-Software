import { Directive, OnInit } from '@angular/core';
import { SpesaTipoEnumRecord } from 'src/enums/SpesaTipoEnum';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[spesa-tipo-lookup]'
})
export class SpesaTipoLookupDirective implements OnInit {

  constructor(
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.data = Object.entries(SpesaTipoEnumRecord).map(([key, value]) => ({
      id: parseInt(key),
      etichetta: value
    }));
  }

}
