import { Directive, OnInit } from '@angular/core';
import { StampanteLookupFiltri } from 'src/models/stampante/stampante-lookup-filtri';
import { StampanteService } from 'src/services/stampante.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[stampante-lookup]',
  providers: [
    StampanteService
  ]
})
export class StampanteLookupDirective implements OnInit {

  constructor(
    private stampanteService: StampanteService,
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.loading = true;
    this.stampanteService.getLookup(new StampanteLookupFiltri()).subscribe({
      next: (response) => {
        this.component.data = response.data;
        this.component.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.component.loading = false;
      }
    });
  }

}
