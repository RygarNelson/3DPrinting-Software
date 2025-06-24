import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { VenditaManagerModel } from 'src/models/vendita/vendita-manager';
import { VenditaService } from 'src/services/vendita.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputDatetimeComponent } from 'src/shared/form-input-datetime/form-input-datetime.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';

@Component({
  selector: 'app-vendita-manager',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TabsModule,
    FormInputTextComponent,
    FormInputDatetimeComponent,
    FormInputSelectComponent,
    ClienteLookupDirective,
    VenditaStatoSpedizioneLookupDirective
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './vendita-manager.component.html',
  styleUrl: './vendita-manager.component.scss'
})
export class VenditaManagerComponent implements OnInit, OnDestroy {
  vendita: VenditaManagerModel = new VenditaManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService
  ){ }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.vendita.id = params['id'] ? Number(params['id']) : 0;
      if (this.vendita.id) {
        this.getVendita();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getVendita(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaService.getVendita(this.vendita.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (result.success) {
          this.vendita = result.data;
        } else {
          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: result
            },
            modal: true
          });
          
          console.error(result);
        }
      },
      error: (error: any) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        console.error(error);
      }
    });
  }

  saveVendita(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.venditaService.save(this.vendita).subscribe({
      next: () => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendita salvata con successo'
        });

        this.indietro();
      },
      error: (error: any) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (error.status === 400) {
          this.MessageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: 'Errore durante il salvataggio della vendita'
          });

          this.listaErrori = error.error.technical_data;
        }
        else {
          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });
        }
      }
    });
  }

  indietro(): void {
    this.router.navigate(['/vendita']);
  }
}
