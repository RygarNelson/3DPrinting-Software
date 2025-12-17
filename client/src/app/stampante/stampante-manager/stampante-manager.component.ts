import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseManager } from 'src/classes/base-manager';
import { StampanteManagerModel } from 'src/models/stampante/stampante-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { LocalstorageService } from 'src/services/localstorage.service';
import { StampanteService } from 'src/services/stampante.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
import { FormInputTextareaComponent } from 'src/shared/form-input-textarea/form-input-textarea.component';

@Component({
  selector: 'app-stampante-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextComponent,
    FormInputTextareaComponent,
    CardModule,
    ButtonModule
  ],
  providers: [
    StampanteService
  ],
  templateUrl: './stampante-manager.component.html',
  styleUrl: './stampante-manager.component.scss'
})
export class StampanteManagerComponent extends BaseManager implements OnInit, OnDestroy {
  @Input() venditaIndex: number = 0;
  @Input() isExternal: boolean = false;

  stampante: StampanteManagerModel = new StampanteManagerModel();

  protected override readonly LOCAL_STORAGE_KEY: string = 'stampante-manager';

  constructor(
    private stampanteService: StampanteService,
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
      this.stampante.id = params['id'] ? Number(params['id']) : 0;
      if (this.stampante.id) {
        this.getStampante();
      } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
        this.stampante = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.stampante.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.stampante);
    }
  }

  private getStampante(): void {
    this.setLoadingTimeout();

    this.stampanteService.getStampante(this.stampante.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

        if (result.success) {
          this.stampante = result.data;
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

  saveStampante(): void {
    this.setLoadingTimeout();
    
    this.stampanteService.save(this.stampante).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stampante salvata con successo'
        });

        if (this.isExternal) {
          this.applicationStateService.newStampante.next({
            id: result.technical_data.id,
            index: this.venditaIndex
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
            detail: 'Errore durante il salvataggio della stampante'
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
      this.applicationStateService.newStampante.next({});
    }
    else {
      this.router.navigate(['/stampante']);
    }
  }
}
