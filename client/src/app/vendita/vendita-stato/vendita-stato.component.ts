import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { VenditaStatoSpedizioneEnum } from 'src/enums/VenditaStatoSpedizioneEnum';

@Component({
  selector: 'vendita-stato',
  imports: [
    CommonModule,
    ChipModule
  ],
  templateUrl: './vendita-stato.component.html',
  styleUrl: './vendita-stato.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VenditaStatoComponent implements OnChanges {
  @Input() stato_spedizione?: VenditaStatoSpedizioneEnum = undefined;
  @Input() isInSelect: boolean = false;

  protected readonly VenditaStatoSpedizioneEnum: typeof VenditaStatoSpedizioneEnum = VenditaStatoSpedizioneEnum;
  protected icon: string = 'pi pi-clock';
  protected descrizione: string = 'Da Spedire';
  protected color: string = '#FFC107';

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.stato_spedizione) {
      case VenditaStatoSpedizioneEnum.DaSpedire: {
        this.icon = 'pi pi-clock';
        this.descrizione = 'Da Spedire';
        this.color = '#FFC107';
        break;
      }
      case VenditaStatoSpedizioneEnum.SpedizioneInCorso: {
        this.icon = 'pi pi-truck';
        this.descrizione = 'In Spedizione';
        this.color = '#2196F3';
        break;
      }
      case VenditaStatoSpedizioneEnum.SpedizioneTerminataCompletamente: {
        this.icon = 'pi pi-check-circle';
        this.descrizione = 'Consegnato';
        this.color = '#4CAF50';
        break;
      }
      case VenditaStatoSpedizioneEnum.SpedizioneFallita: {
        this.icon = 'pi pi-times';
        this.descrizione = 'Fallita';
        this.color = '#F44336';
        break;
      }
      case VenditaStatoSpedizioneEnum.SpedizioneTerminataParzialmente: {
        this.icon = 'pi pi-check';
        this.descrizione = 'Consegna Parziale';
        this.color = '#2196F3';
        break;
      }
      default: {
        this.icon = '';
        this.descrizione = '';
        this.color = '';
        break;
      }
    }
  }
}
