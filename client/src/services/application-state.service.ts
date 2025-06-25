import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  clienteLookupUpdate: Subject<void> = new Subject<void>();
  modelloLookupUpdate: Subject<void> = new Subject<void>();
  stampanteLookupUpdate: Subject<void> = new Subject<void>();
}
