import { Directive, OnInit } from '@angular/core';
import { VenditaStatoSpedizioneEnumRecord } from 'src/enums/VenditaStatoSpedizioneEnum';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[vendita-stato-spedizione-lookup]'
})
export class VenditaStatoSpedizioneLookupDirective implements OnInit {

  constructor(
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.data = Object.entries(VenditaStatoSpedizioneEnumRecord).map(([key, value]) => ({
      id: parseInt(key),
      etichetta: value
    }));
  }

}
