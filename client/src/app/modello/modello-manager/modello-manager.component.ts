import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { ModelloManagerModel } from 'src/models/modello/modello-manager';
import { ModelloService } from 'src/services/modello.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
import { FormInputTextareaComponent } from 'src/shared/form-input-textarea/form-input-textarea.component';

@Component({
  selector: 'app-modello-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextComponent,
    FormInputTextareaComponent,
    CardModule,
    ButtonModule
  ],
  providers: [
    ModelloService
  ],
  templateUrl: './modello-manager.component.html',
  styleUrl: './modello-manager.component.scss'
})
export class ModelloManagerComponent implements OnInit, OnDestroy {
  @Input() venditaIndex: number = 0;

  modello: ModelloManagerModel = new ModelloManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private modelloService: ModelloService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ){ }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.modello.id = params['id'] ? Number(params['id']) : 0;
      if (this.modello.id) {
        this.getModello();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getModello(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.modelloService.getModello(this.modello.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (result.success) {
          this.modello = result.data;
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
    
    this.modelloService.save(this.modello).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Modello salvato con successo'
        });

        if (this.ref) {
          this.ref.close({
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
    if (this.ref) {
      this.ref.close();
    }
    else {
      this.router.navigate(['/modello']);
    }
  }
}
