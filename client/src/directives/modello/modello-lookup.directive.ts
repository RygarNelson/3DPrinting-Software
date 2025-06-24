import { Directive, OnInit } from '@angular/core';
import { ModelloLookupFiltri } from 'src/models/modello/modello-lookup.filtri';
import { ApplicationStateService } from 'src/services/application-state.service';
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
    private component: FormInputSelectComponent,
    private applicationStateService: ApplicationStateService
  ) {
    this.applicationStateService.modelloLookupUpdate.subscribe(() => {
      this.loadLookup();
    });
  }

  ngOnInit(): void {
    this.loadLookup();
  }

  private loadLookup(): void {
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
