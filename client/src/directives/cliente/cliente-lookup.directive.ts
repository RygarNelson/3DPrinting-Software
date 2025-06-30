import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClienteLookupFiltri } from 'src/models/cliente/cliente-looku-filtri';
import { ApplicationStateService } from 'src/services/application-state.service';
import { ClienteService } from 'src/services/cliente.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[cliente-lookup]',
  providers: [
    ClienteService
  ]
})
export class ClienteLookupDirective implements OnInit, OnDestroy {

  private subscription?: Subscription;

  constructor(
    private clienteService: ClienteService,
    private component: FormInputSelectComponent,
    private applicationStateService: ApplicationStateService
  ) {
    this.subscription = this.applicationStateService.clienteLookupUpdate.subscribe(() => {
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
    this.clienteService.getLookup(new ClienteLookupFiltri()).subscribe({
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
