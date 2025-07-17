import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ModelloTipoLookupDirective } from 'src/directives/modello/modello-tipo-lookup.directive';
import { ModelloListingModel, ModelloListingResponse } from 'src/models/modello/modello-listing';
import { ModelloListingFiltri } from 'src/models/modello/modello-listing-filtri';
import { ModelloService } from 'src/services/modello.service';
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
export class ModelloListingComponent implements OnDestroy {
// Data properties
modelli: ModelloListingModel[] = [];
totalRecords: number = 0;
loading: boolean = false;

// Filter properties
filtri: ModelloListingFiltri = {
  offset: 0,
  limit: 10,
  search: ''
};

private modelliSubscription?: Subscription;
private modelloDeleteSubscription?: Subscription;
private loadingTimeout?: number;

constructor(
  private modelloService: ModelloService,
  private router: Router,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private dialogService: DialogService
) {}

ngOnDestroy(): void {
  this.modelliSubscription?.unsubscribe();
  this.modelloDeleteSubscription?.unsubscribe();
  clearTimeout(this.loadingTimeout);
}

loadModelli(): void {
  this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
  
  this.modelliSubscription = this.modelloService.getListing(this.filtri)
    .subscribe({
      next: (response: ModelloListingResponse) => {
        this.modelli = response.data;
        this.totalRecords = response.count;

        window.clearTimeout(this.loadingTimeout);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stampanti:', error);

        window.clearTimeout(this.loadingTimeout);
        this.loading = false;
      }
    });
}

loadData(event: TableLazyLoadEvent): void {
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

  this.loadModelli();
}

pulisciFiltri(): void {
  this.filtri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  this.loadData({
    first: 0,
    rows: 10,
    globalFilter: ''
  });
}

refreshTable(): void {
  this.loadModelli();
}

addNewModello(): void {
  this.router.navigate(['/modello/manager']);
}

editModello(modello: ModelloListingModel): void {
  this.router.navigate(['/modello/manager', modello.id]);
}

confirmDelete(event: Event, modello: ModelloListingModel): void {
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
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Modello cancellato con successo'
        });

        this.loadModelli();
      },
      error: (error) => {
        window.clearTimeout(this.loadingTimeout);
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
}
