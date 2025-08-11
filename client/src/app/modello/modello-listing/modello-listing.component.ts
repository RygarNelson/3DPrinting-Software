import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ModelloTipoLookupDirective } from 'src/directives/modello/modello-tipo-lookup.directive';
import { ModelloListingGridModel, ModelloListingGridResponse, ModelloListingTableModel, ModelloListingTableResponse } from 'src/models/modello/modello-listing';
import { ModelloListingFiltri } from 'src/models/modello/modello-listing-filtri';
import { ModelloService } from 'src/services/modello.service';
import { AuditLogComponent } from 'src/shared/audit-log/audit-log.component';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { ModelloTipoComponent } from '../modello-tipo/modello-tipo.component';
import { ModelloListingEliminaMessaggioPipe } from '../pipes/modello-listing-elimina-messaggio.pipe';

@Component({
  selector: 'app-modello-listing',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    TooltipModule,
    ModelloListingEliminaMessaggioPipe,
    ModelloTipoLookupDirective,
    FormInputSelectComponent,
    ModelloTipoComponent
  ],
  providers: [
    ModelloService
  ],
  templateUrl: './modello-listing.component.html',
  styleUrl: './modello-listing.component.scss'
})
export class ModelloListingComponent implements OnInit, OnDestroy {
// Data properties
modelliTable: ModelloListingTableModel[] = [];
modelliGrid: ModelloListingGridModel[] = [];
totalRecords: number = 0;
loading: boolean = false;

// Filter properties
filtri: ModelloListingFiltri = {
  offset: 0,
  limit: 10,
  search: ''
};

// Array reference for template
Array = Array;

private modelliTableSubscription?: Subscription;
private modelliGridSubscription?: Subscription;
private modelloDeleteSubscription?: Subscription;
private modelloImpostaInVenditaVintedSubscription?: Subscription;
private loadingTimeout?: number;

constructor(
  private modelloService: ModelloService,
  private router: Router,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private dialogService: DialogService
) {}

ngOnInit(): void {
}

ngOnDestroy(): void {
  this.modelliTableSubscription?.unsubscribe();
  this.modelliGridSubscription?.unsubscribe();
  this.modelloDeleteSubscription?.unsubscribe();
  this.modelloImpostaInVenditaVintedSubscription?.unsubscribe();

  clearTimeout(this.loadingTimeout);
  this.loadingTimeout = undefined;
}

loadModelliTable(): void {
  this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
  
  this.modelliTableSubscription = this.modelloService.getListingTable(this.filtri)
    .subscribe({
      next: (response: ModelloListingTableResponse) => {
        this.modelliTable = response.data;
        this.totalRecords = response.count;

        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stampanti:', error);

        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
      }
    });
}

loadModelliGrid(): void {
  if (this.loadingTimeout == null) {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
  }
  
  this.modelliGridSubscription = this.modelloService.getListingGrid(this.filtri)
    .subscribe({
      next: (response: ModelloListingGridResponse) => {
        this.modelliGrid = response.data;
        this.totalRecords = response.count;

        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
      }
    });
}

loadDataTable(event: TableLazyLoadEvent): void {
  this.filtri.offset = event.first;
  this.filtri.limit = event.rows ?? 10;

  // Global filter
  if (event.globalFilter) {
    this.filtri.search = typeof event.globalFilter === 'string' ? event.globalFilter : event.globalFilter[0];
  }
  else {
    this.filtri.search = undefined;
  }

  // Sorting
  if (event.sortField) {
    this.filtri.order = {
      column: typeof event.sortField === 'string' ? event.sortField : event.sortField[0],
      direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
    }
  }
  else {
    this.filtri.order = undefined;
  }

  this.loadModelliTable();
  this.loadModelliGrid();
}

pulisciFiltri(): void {
  this.filtri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  this.loadDataTable({
    first: 0,
    rows: 10,
    globalFilter: ''
  });
}

refreshTable(): void {
  this.loadModelliTable();
  this.loadModelliGrid();
}

addNewModello(): void {
  this.router.navigate(['/modello/manager']);
}

editModello(event: Event, modello: ModelloListingTableModel | ModelloListingGridModel): void {
  event.stopPropagation();
  this.router.navigate(['/modello/manager', modello.id]);
}

viewAuditLog(event: Event, modello: ModelloListingTableModel | ModelloListingGridModel): void {
  event.stopPropagation();
  let config: DynamicDialogConfig = {
    width: '90%',
    height: '80%',
    modal: true,
    dismissableMask: true,
    closable: true,
    showHeader: false,
    contentStyle: {
      'height': '100%',
      'width': '100%',
      'padding': '0px'
    },
    data: {
      tableName: 'T_MODELLI',
      recordId: modello.id,
      objectName: `Modello ${modello.nome} (${modello.id})`
    }
  };
  this.dialogService.open(AuditLogComponent, config);
}

confirmDelete(event: Event, modello: ModelloListingTableModel | ModelloListingGridModel): void {
  event.stopPropagation();

  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: `Sei sicuro di voler eliminare il modello "${modello.nome}"?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Si',
    rejectLabel: 'No',
    acceptIcon: 'pi pi-exclamation-triangle',
    rejectIcon: 'pi pi-times',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.deleteModello(modello.id);
    },
    reject: () => {
      // User rejected the deletion
    }
  });
}

private deleteModello(id: number): void {
  this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

  this.modelloDeleteSubscription = this.modelloService.delete(id)
    .subscribe({
      next: () => {
        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Modello cancellato con successo'
        });

        this.loadModelliTable();
        this.loadModelliGrid();
      },
      error: (error) => {
        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;

        this.dialogService.open(DialogErrorComponent, {
          inputValues: {
            error: error
          },
          modal: true
        });
        
        console.error('Error deleting modello:', error);
      }
    });
}

  // Cross interaction methods
  impostaModelloVendibileVinted(modello: ModelloListingGridModel): void {
    if (modello != null && modello.id != null && modello.vinted_vendibile && !modello.vinted_is_in_vendita) {
      if (this.loadingTimeout == null) {
        this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
      }

      this.modelloImpostaInVenditaVintedSubscription = this.modelloService.impostaInVenditaVinted({ id: modello.id })
        .subscribe({
          next: () => {
            window.clearTimeout(this.loadingTimeout);
            this.loadingTimeout = undefined;
            this.loading = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Modello impostato in vendita su Vinted con successo'
            });

            this.loadModelliGrid();
          }
        });
    }
  }
}
