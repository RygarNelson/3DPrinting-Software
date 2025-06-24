import { Directive, OnInit } from '@angular/core';
import { VenditaDettaglioStatoStampaEnumRecord } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[vendita-dettaglio-stato-stampa-lookup]'
})
export class VenditaDettaglioStatoStampaLookupDirective implements OnInit {

  constructor(
    private component: FormInputSelectComponent
  ) { } 

  ngOnInit(): void {
    this.component.data = Object.entries(VenditaDettaglioStatoStampaEnumRecord).map(([key, value]) => ({
      id: parseInt(key),
      etichetta: value
    }));
  }

}
