import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ApplicationStateService } from 'src/services/application-state.service';
import { VenditaService } from 'src/services/vendita.service';

@Component({
  selector: 'app-vendita-etichetta-spedizione',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './vendita-etichetta-spedizione.component.html',
  styleUrl: './vendita-etichetta-spedizione.component.scss'
})
export class VenditaEtichettaSpedizioneComponent {
  @Input() venditaId?: number;
  @Input() etichettaSpedizione?: string;
  @Output() onEtichettaChange = new EventEmitter<string | null>();

  uploadEtichettaSpedizioneLoading = false;
  downloadEtichettaSpedizioneLoading = false;
  openEtichettaSpedizioneLoading = false;
  deleteEtichettaSpedizioneLoading = false;

  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    public applicationStateService: ApplicationStateService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: 'Solo file PDF sono consentiti'
        });
        input.value = '';
        return;
      }

      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: 'Il file non può superare i 2MB'
        });
        input.value = '';
        return;
      }

      // Upload file if vendita has an ID
      if (this.venditaId && this.venditaId > 0) {
        this.uploadFile(file);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Attenzione',
          detail: "Salva prima la vendita per caricare l'etichetta spedizione"
        });
        input.value = '';
      }
    }
  }

  uploadFile(file: File): void {
    if (!this.venditaId) return;

    this.uploadEtichettaSpedizioneLoading = true;
    this.setLoadingTimeout();

    this.venditaService.uploadEtichettaSpedizione(this.venditaId, file).subscribe({
      next: (result) => {
        this.uploadEtichettaSpedizioneLoading = false;
        this.clearLoadingTimeout();

        if (result.success) {
          this.etichettaSpedizione = result.data.path;
          this.onEtichettaChange.emit(this.etichettaSpedizione);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Etichetta spedizione caricata con successo'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: result.error || 'Errore durante il caricamento del file'
          });
        }
      },
      error: (error: any) => {
        this.uploadEtichettaSpedizioneLoading = false;
        this.clearLoadingTimeout();

        let errorMessage = 'Errore durante il caricamento del file';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: errorMessage
        });
      }
    });
  }

  downloadEtichettaSpedizione(): void {
    if (!this.venditaId || this.venditaId <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attenzione',
        detail: 'Vendita non salvata'
      });
      return;
    }

    this.downloadEtichettaSpedizioneLoading = true;
    this.setLoadingTimeout();

    this.venditaService.downloadEtichettaSpedizione(this.venditaId).subscribe({
      next: (blob: Blob) => {
        this.downloadEtichettaSpedizioneLoading = false;
        this.clearLoadingTimeout();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `etichetta_spedizione_vendita_${this.venditaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Download avviato'
        });
      },
      error: (error: any) => {
        this.downloadEtichettaSpedizioneLoading = false;
        this.clearLoadingTimeout();

        let errorMessage = 'Errore durante il download del file';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: errorMessage
        });
      }
    });
  }

  openEtichettaSpedizione(): void {
    if (!this.venditaId || this.venditaId <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attenzione',
        detail: 'Vendita non salvata'
      });
      return;
    }

    if (!this.etichettaSpedizione) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attenzione',
        detail: 'Nessuna etichetta spedizione disponibile'
      });
      return;
    }

    this.openEtichettaSpedizioneLoading = true;
    this.venditaService.downloadEtichettaSpedizione(this.venditaId).subscribe({
      next: (blob: Blob) => {
        this.openEtichettaSpedizioneLoading = false;
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      },
      error: (error: any) => {
        this.openEtichettaSpedizioneLoading = false;
        let errorMessage = "Errore durante l'apertura del file";
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: errorMessage
        });
      }
    });
  }

  deleteEtichettaSpedizione(event: Event): void {
    event.stopPropagation();
    if (!this.venditaId || this.venditaId <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attenzione',
        detail: 'Vendita non salvata'
      });
      return;
    }

    this.confirmationService.confirm({
      message: "Sei sicuro di voler eliminare l'etichetta spedizione?",
      icon: 'pi pi-exclamation-triangle',
      target: document.getElementById('delete-etichetta-spedizione-button')!,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.deleteEtichettaSpedizioneLoading = true;
        this.setLoadingTimeout();

        this.venditaService.deleteEtichettaSpedizione(this.venditaId!).subscribe({
          next: (result) => {
            this.deleteEtichettaSpedizioneLoading = false;
            this.clearLoadingTimeout();

            if (result.success) {
              this.etichettaSpedizione = undefined;
              this.onEtichettaChange.emit(null);

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Etichetta spedizione eliminata con successo'
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Errore',
                detail: result.error || "Errore durante l'eliminazione del file"
              });
            }
          },
          error: (error: any) => {
            this.deleteEtichettaSpedizioneLoading = false;
            this.clearLoadingTimeout();

            let errorMessage = "Errore durante l'eliminazione del file";
            if (error.error && error.error.error) {
              errorMessage = error.error.error;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Errore',
              detail: errorMessage
            });
          }
        });
      }
    });
  }

  private setLoadingTimeout() {
    this.loadingTimeout = window.setTimeout(() => {
      // Just a marker
    }, 10000);
  }

  private clearLoadingTimeout() {
    if (this.loadingTimeout) {
      window.clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
    }
  }
}
