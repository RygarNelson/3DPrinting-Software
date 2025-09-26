import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { SaveFromDialogEventInterface } from 'src/interfaces/save-from-dialog-event-interface';
import { ContoBancarioLookup } from 'src/models/conto-bancario/conto-bancario-lookup';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  clienteLookupUpdate: Subject<void> = new Subject<void>();
  newCliente: Subject<SaveFromDialogEventInterface> = new Subject<SaveFromDialogEventInterface>();

  modelloLookupUpdate: Subject<void> = new Subject<void>();
  newModello: Subject<SaveFromDialogEventInterface> = new Subject<SaveFromDialogEventInterface>();

  stampanteLookupUpdate: Subject<void> = new Subject<void>();
  newStampante: Subject<SaveFromDialogEventInterface> = new Subject<SaveFromDialogEventInterface>();

  contoBancarioLookupUpdate: Subject<void> = new Subject<void>();
  contoBancarioLookup: Subject<ContoBancarioLookup[]> = new Subject<ContoBancarioLookup[]>();
  newContoBancario: Subject<SaveFromDialogEventInterface> = new Subject<SaveFromDialogEventInterface>();

  // Signal holding current width
  private readonly width: WritableSignal<number> = signal<number>(window.innerWidth);

  // Breakpoint signals
  readonly isXS: Signal<boolean> = computed(() => this.width() < 576);
  readonly isS: Signal<boolean> = computed(() => this.width() >= 576 && this.width() < 768);
  readonly isM: Signal<boolean> = computed(() => this.width() >= 768 && this.width() < 992);
  readonly isL: Signal<boolean> = computed(() => this.width() >= 992 && this.width() < 1200);
  readonly isXL: Signal<boolean> = computed(() => this.width() >= 1200 && this.width() < 1400);
  readonly isXXL: Signal<boolean> = computed(() => this.width() >= 1400);

  // Grouped categories
  readonly isMobile = computed(() => this.isXS() || this.isS()); // <768
  readonly isTablet = computed(() => this.isM());                 // 768–991
  readonly isSmallLaptop = computed(() => this.isL());            // 992–1199
  readonly isDesktop = computed(() => this.isXL() || this.isXXL()); // ≥1200
  
  constructor() {
    // Listen for resize and update width
    window.addEventListener('resize', () => {
      this.width.set(window.innerWidth);
    });
  }
}
