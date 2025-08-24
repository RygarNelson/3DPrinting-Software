import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseManager } from 'src/classes/base-manager';
import { ClienteManagerModel } from 'src/models/cliente/cliente-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { ClienteService } from 'src/services/cliente.service';
import { LocalstorageService } from 'src/services/localstorage.service';
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
export class ClienteManagerComponent extends BaseManager implements OnInit, OnDestroy {
  @Input() isExternal: boolean = false;
  
  cliente: ClienteManagerModel = new ClienteManagerModel();

  protected override readonly LOCAL_STORAGE_KEY: string = 'cliente-manager';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private applicationStateService: ApplicationStateService,
    private localStorageService: LocalstorageService
  ){
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cliente.id = params['id'] ? Number(params['id']) : 0;
      if (this.cliente.id) {
        this.getCliente();
      } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
        this.cliente = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.cliente.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.cliente);
    }
  }

  private getCliente(): void {
    this.setLoadingTimeout();

    this.clienteService.getCliente(this.cliente.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

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
        this.clearLoadingTimeout();

        console.error(error);
      }
    });
  }

  saveCliente(): void {
    this.setLoadingTimeout();
    
    this.clienteService.save(this.cliente).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cliente salvato con successo'
        });

        if (this.isExternal) {
          this.applicationStateService.newCliente.next({
            id: result.technical_data.id
          });
        }
        else {
          this.indietro();
        }
      },
      error: (error: any) => {
        this.clearLoadingTimeout();

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
    if (this.isExternal) {
      this.applicationStateService.newCliente.next({});
    }
    else {
      this.router.navigate(['/cliente']);
    }
  }
} 