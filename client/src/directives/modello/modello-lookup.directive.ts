import { Directive, OnInit } from '@angular/core';
import { ModelloLookupFiltri } from 'src/models/modello/modello-lookup.filtri';
import { ModelloService } from 'src/services/modello.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[modello-lookup]',
  providers: [
    ModelloService
  ]
})
export class ModelloLookupDirective implements OnInit {

  constructor(
    private modelloService: ModelloService,
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.component.loading = true;
    this.modelloService.getLookup(new ModelloLookupFiltri()).subscribe({
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
