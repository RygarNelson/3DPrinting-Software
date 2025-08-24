import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseManager } from 'src/classes/base-manager';
import { ContoBancarioManagerModel } from 'src/models/conto-bancario/conto-bancario-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { ContoBancarioService } from 'src/services/conto-bancario.service';
import { LocalstorageService } from 'src/services/localstorage.service';
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
export class ContoBancarioManagerComponent extends BaseManager implements OnInit, OnDestroy {
  @Input() isExternal: boolean = false;

  conto_bancario: ContoBancarioManagerModel = new ContoBancarioManagerModel();

  protected override readonly LOCAL_STORAGE_KEY: string = 'conto-bancario-manager';

  constructor(
    private contoBancarioService: ContoBancarioService,
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
    // Get router params
    this.route.params.subscribe(params => {
      this.conto_bancario.id = params['id'] ? Number(params['id']) : 0;
      if (this.conto_bancario.id) {
        this.getContoBancario();
      } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
        this.conto_bancario = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.conto_bancario.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.conto_bancario);
    }
  }

  private getContoBancario(): void {
    this.setLoadingTimeout();

    this.contoBancarioService.getContoBancario(this.conto_bancario.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

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
        this.clearLoadingTimeout();

        console.error(error);
      }
    });
  }

  saveContoBancario(): void {
    this.setLoadingTimeout();

    this.contoBancarioService.save(this.conto_bancario).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

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
        this.clearLoadingTimeout();

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
