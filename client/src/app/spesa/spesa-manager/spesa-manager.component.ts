import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseManager } from 'src/classes/base-manager';
import { SpesaTipoLookupDirective } from 'src/directives/spesa/spesa-tipo-lookup.directive';
import { SpesaUnitaMisuraLookupDirective } from 'src/directives/spesa/spesa-unita-misura-lookup.directive';
import { SpesaManagerModel } from 'src/models/spesa/spesa-manager';
import { LocalstorageService } from 'src/services/localstorage.service';
import { SpesaService } from 'src/services/spesa.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputDatetimeComponent } from 'src/shared/form-input-datetime/form-input-datetime.component';
import { FormInputNumberComponent } from 'src/shared/form-input-number/form-input-number.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextareaComponent } from 'src/shared/form-input-textarea/form-input-textarea.component';

@Component({
  selector: 'app-spesa-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextareaComponent,
    FormInputDatetimeComponent,
    FormInputNumberComponent,
    FormInputSelectComponent,
    CardModule,
    ButtonModule,
    SpesaTipoLookupDirective,
    SpesaUnitaMisuraLookupDirective
  ],
  providers: [
    SpesaService,
  ],
  templateUrl: './spesa-manager.component.html',
  styleUrl: './spesa-manager.component.scss'
})
export class SpesaManagerComponent extends BaseManager implements OnInit, OnDestroy {
  spesa: SpesaManagerModel = new SpesaManagerModel();

  protected override readonly LOCAL_STORAGE_KEY: string = 'spesa-manager';

  constructor(
    private spesaService: SpesaService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private localStorageService: LocalstorageService
  ){
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.spesa.id = params['id'] ? Number(params['id']) : 0;
      if (this.spesa.id) {
        this.getSpesa();
      } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
        this.spesa = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.spesa.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.spesa);
    }
  }

  private getSpesa(): void {
    this.setLoadingTimeout();

    this.spesaService.getSpesa(this.spesa.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

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
        this.clearLoadingTimeout();

        console.error(error);
      }
    });
  }

  saveSpesa(): void {
    this.setLoadingTimeout();
    
    this.spesaService.save(this.spesa).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Spesa salvata con successo'
        });

        this.indietro();
      },
      error: (error: any) => {
        this.clearLoadingTimeout();

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
