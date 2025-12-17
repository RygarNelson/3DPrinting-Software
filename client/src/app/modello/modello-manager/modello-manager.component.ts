import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseManager } from 'src/classes/base-manager';
import { ModelloBasettaDimensioneDirective } from 'src/directives/modello/modello-basetta-dimensione.directive';
import { ModelloTipoEnum } from 'src/enums/ModelloTipoEnum';
import { ModelloManagerModel } from 'src/models/modello/modello-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { LocalstorageService } from 'src/services/localstorage.service';
import { ModelloService } from 'src/services/modello.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputCheckboxComponent } from 'src/shared/form-input-checkbox/form-input-checkbox.component';
import { FormInputNumberComponent } from "src/shared/form-input-number/form-input-number.component";
import { FormInputRadiobuttonComponent } from 'src/shared/form-input-radiobutton/form-input-radiobutton.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
import { FormInputTextareaComponent } from 'src/shared/form-input-textarea/form-input-textarea.component';

@Component({
  selector: 'app-modello-manager',
  imports: [
    CommonModule,
    FormsModule,
    FormInputTextComponent,
    FormInputTextareaComponent,
    FormInputRadiobuttonComponent,
    FormInputNumberComponent,
    FormInputSelectComponent,
    CardModule,
    ButtonModule,
    ModelloBasettaDimensioneDirective,
    FormInputCheckboxComponent
  ],
  providers: [
    ModelloService
  ],
  templateUrl: './modello-manager.component.html',
  styleUrl: './modello-manager.component.scss'
})
export class ModelloManagerComponent extends BaseManager implements OnInit, OnDestroy {
  @Input() venditaIndex: number = 0;
  @Input() isExternal: boolean = false;

  modello: ModelloManagerModel = new ModelloManagerModel();

  protected override readonly LOCAL_STORAGE_KEY: string = 'modello-manager';
  protected ModelloTipoEnum = ModelloTipoEnum;

  constructor(
    private modelloService: ModelloService,
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
      this.modello.id = params['id'] ? Number(params['id']) : 0;
      if (this.modello.id) {
        this.getModello();
      } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
        this.modello = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.modello.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.modello);
    }
  }

  private getModello(): void {
    this.setLoadingTimeout();

    this.modelloService.getModello(this.modello.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

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
        this.clearLoadingTimeout();

        console.error(error);
      }
    });
  }

  saveModello(): void {
    this.setLoadingTimeout();
    
    this.modelloService.save(this.modello).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Modello salvato con successo'
        });

        if (this.isExternal) {
          this.applicationStateService.newModello.next({
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
      this.applicationStateService.newModello.next({});
    } else {
      this.router.navigate(['/modello']);
    }
  }
}
