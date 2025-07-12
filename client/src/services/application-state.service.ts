import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SaveFromDialogEventInterface } from 'src/interfaces/save-from-dialog-event-interface';

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
  newContoBancario: Subject<SaveFromDialogEventInterface> = new Subject<SaveFromDialogEventInterface>();
}
