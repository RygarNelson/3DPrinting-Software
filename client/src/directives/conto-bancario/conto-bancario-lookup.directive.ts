import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContoBancarioLookupFiltri } from 'src/models/conto-bancario/conto-bancario-lookup.filtri';
import { ContoBancarioService } from 'src/services/conto-bancario.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[conto-bancario-lookup]',
  providers: [
    ContoBancarioService
  ]
})
export class ContoBancarioLookupDirective implements OnInit, OnDestroy {

  private subscription?: Subscription;

  constructor(
    private contoBancarioService: ContoBancarioService,
    private component: FormInputSelectComponent
  ) { }

  ngOnInit(): void {
    this.loadLookup();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadLookup(): void {
    this.component.loading = true;
    this.contoBancarioService.getLookup(new ContoBancarioLookupFiltri()).subscribe({
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
