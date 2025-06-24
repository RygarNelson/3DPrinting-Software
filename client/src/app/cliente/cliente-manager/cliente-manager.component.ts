import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { ClienteManagerModel } from 'src/models/cliente/cliente-manager';
import { ClienteService } from 'src/services/cliente.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';

@Component({
  selector: 'app-cliente-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextComponent,
    CardModule,
    ButtonModule
  ],
  providers: [
    ClienteService
  ],
  templateUrl: './cliente-manager.component.html'
})
export class ClienteManagerComponent implements OnInit, OnDestroy {
  cliente: ClienteManagerModel = new ClienteManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ){ }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cliente.id = params['id'] ? Number(params['id']) : 0;
      if (this.cliente.id) {
        this.getCliente();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getCliente(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.clienteService.getCliente(this.cliente.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (result.success) {
          this.cliente = result.data;
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

  saveCliente(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.clienteService.save(this.cliente).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cliente salvato con successo'
        });

        if (this.ref) {
          this.ref.close(result.technical_data.id);
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
            detail: 'Errore durante il salvataggio del cliente'
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
    if (this.ref) {
      this.ref.close();
    }
    else {
      this.router.navigate(['/cliente']);
    }
  }
} 