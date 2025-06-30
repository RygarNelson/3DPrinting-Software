import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { ModelloTipoEnum } from 'src/enums/ModelloTipoEnum';

@Component({
  selector: 'modello-tipo',
  imports: [
    CommonModule,
    ChipModule
  ],
  templateUrl: './modello-tipo.component.html',
  styleUrl: './modello-tipo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelloTipoComponent implements OnChanges {
  @Input() tipo?: ModelloTipoEnum = undefined;
  @Input() isInSelect: boolean = false;
  @Input() descrizioneModello?: string;

  protected readonly ModelloTipoEnum: typeof ModelloTipoEnum = ModelloTipoEnum;
  protected icon: string = 'pi pi-circle';
  protected descrizione: string = 'PLA';
  protected color: string = '#0a0a0a';

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.tipo) {
      case ModelloTipoEnum.PLA: {
        this.icon = 'pi pi-circle';
        if (this.descrizioneModello) {
          this.descrizione = this.descrizioneModello;
        } else {
          this.descrizione = 'PLA';
        }
        this.color = '#0a0a0a';
        break;
      }
      case ModelloTipoEnum.RESINA: {
        this.icon = 'pi pi-box';
        if (this.descrizioneModello) {
          this.descrizione = this.descrizioneModello;
        } else {
          this.descrizione = 'Resina';
        }
        this.color = '#808080';
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
