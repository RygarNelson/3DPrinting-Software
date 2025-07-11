import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { StampanteManagerModel } from 'src/models/stampante/stampante-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
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
export class StampanteManagerComponent implements OnInit, OnDestroy {
  @Input() venditaIndex: number = 0;
  @Input() isExternal: boolean = false;

  stampante: StampanteManagerModel = new StampanteManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private stampanteService: StampanteService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private applicationStateService: ApplicationStateService
  ){ }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.stampante.id = params['id'] ? Number(params['id']) : 0;
      if (this.stampante.id) {
        this.getStampante();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getStampante(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.stampanteService.getStampante(this.stampante.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

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
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        console.error(error);
      }
    });
  }

  saveStampante(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.stampanteService.save(this.stampante).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

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
        clearTimeout(this.loadingTimeout);
        this.loading = false;

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
