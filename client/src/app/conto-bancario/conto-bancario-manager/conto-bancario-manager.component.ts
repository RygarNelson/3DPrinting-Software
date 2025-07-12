import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ContoBancarioManagerModel } from 'src/models/conto-bancario/conto-bancario-manager';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { ApplicationStateService } from 'src/services/application-state.service';
import { ContoBancarioService } from 'src/services/conto-bancario.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';

@Component({
  selector: 'app-conto-bancario-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextComponent,
    CardModule,
    ButtonModule
  ],
  providers: [
    ContoBancarioService
  ],
  templateUrl: './conto-bancario-manager.component.html',
  styleUrl: './conto-bancario-manager.component.scss'
})
export class ContoBancarioManagerComponent implements OnInit, OnDestroy {

  @Input() isExternal: boolean = false;

  conto_bancario: ContoBancarioManagerModel = new ContoBancarioManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private contoBancarioService: ContoBancarioService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private applicationStateService: ApplicationStateService
  ){ }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.conto_bancario.id = params['id'] ? Number(params['id']) : 0;
      if (this.conto_bancario.id) {
        this.getContoBancario();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getContoBancario(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }

    this.contoBancarioService.getContoBancario(this.conto_bancario.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;

        if (result.success) {
          this.conto_bancario = result.data;
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
        this.loadingTimeout = undefined;
        this.loading = false;

        console.error(error);
      }
    });
  }

  saveContoBancario(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }

    this.contoBancarioService.save(this.conto_bancario).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Conto bancario salvato con successo'
        });

        if (this.isExternal) {
          this.applicationStateService.newContoBancario.next({
            id: result.technical_data.id
          });
        }
        else {
          this.indietro();
        }
      },
      error: (error: any) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (error.status === 400) {
          this.MessageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: 'Errore durante il salvataggio del modello'
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
    if (this.isExternal) {
      this.applicationStateService.newContoBancario.next({});
    }
    else {
      this.router.navigate(['/conto-bancario']);
    }
  }

}
