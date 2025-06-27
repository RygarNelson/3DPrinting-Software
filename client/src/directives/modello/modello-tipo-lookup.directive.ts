import { Directive, OnInit } from '@angular/core';
import { ModelloTipoEnumRecord } from 'src/enums/ModelloTipoEnum';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[modello-tipo-lookup]'
})
export class ModelloTipoLookupDirective implements OnInit {

  constructor(
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.data = Object.entries(ModelloTipoEnumRecord).map(([key, value]) => ({
      id: parseInt(key),
      etichetta: value
    }));
  }

}
