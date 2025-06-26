import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { SpesaManagerModel } from 'src/models/spesa/spesa-manager';
import { SpesaService } from 'src/services/spesa.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputDatetimeComponent } from 'src/shared/form-input-datetime/form-input-datetime.component';
import { FormInputNumberComponent } from 'src/shared/form-input-number/form-input-number.component';
import { FormInputTextareaComponent } from 'src/shared/form-input-textarea/form-input-textarea.component';

@Component({
  selector: 'app-spesa-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextareaComponent,
    FormInputDatetimeComponent,
    FormInputNumberComponent,
    CardModule,
    ButtonModule
  ],
  providers: [
    SpesaService,
  ],
  templateUrl: './spesa-manager.component.html',
  styleUrl: './spesa-manager.component.scss'
})
export class SpesaManagerComponent implements OnInit, OnDestroy {

  spesa: SpesaManagerModel = new SpesaManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  private loadingTimeout?: number;

  constructor(
    private spesaService: SpesaService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
  ){ }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.spesa.id = params['id'] ? Number(params['id']) : 0;
      if (this.spesa.id) {
        this.getSpesa();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }

  private getSpesa(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.spesaService.getSpesa(this.spesa.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (result.success) {
          this.spesa = result.data;
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

  saveSpesa(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.spesaService.save(this.spesa).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Spesa salvata con successo'
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
            detail: 'Errore durante il salvataggio della spesa'
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
    this.router.navigate(['/spesa/listing']);
  }
}
