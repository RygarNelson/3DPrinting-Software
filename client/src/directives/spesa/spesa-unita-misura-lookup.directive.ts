import { Directive, OnInit } from '@angular/core';
import { SpesaUnitaMisuraEnumRecord } from 'src/enums/SpesaUnitaMisuraEnum';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[spesa-unita-misura-lookup]'
})
export class SpesaUnitaMisuraLookupDirective implements OnInit {

  constructor(
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.data = Object.entries(SpesaUnitaMisuraEnumRecord).map(([key, value]) => ({
      id: parseInt(key),
      etichetta: value
    }));
  }

}
