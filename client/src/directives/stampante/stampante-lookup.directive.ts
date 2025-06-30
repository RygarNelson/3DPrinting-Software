import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StampanteLookupFiltri } from 'src/models/stampante/stampante-lookup-filtri';
import { ApplicationStateService } from 'src/services/application-state.service';
import { StampanteService } from 'src/services/stampante.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[stampante-lookup]',
  providers: [
    StampanteService
  ]
})
export class StampanteLookupDirective implements OnInit, OnDestroy {

  private subscription?: Subscription;

  constructor(
    private stampanteService: StampanteService,
    private component: FormInputSelectComponent,
    private applicationStateService: ApplicationStateService
  ) {
    this.subscription = this.applicationStateService.stampanteLookupUpdate.subscribe(() => {
      this.loadLookup();
    });
  }

  ngOnInit(): void {
    this.loadLookup();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadLookup(): void {
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
