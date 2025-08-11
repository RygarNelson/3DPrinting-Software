import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeysLength',
  standalone: true,
  pure: true
})
export class ObjectKeysLengthPipe implements PipeTransform {
  transform(obj: any): number {
    // Helper pipe to get the number of keys in an object
    return obj ? Object.keys(obj).length : 0;
  }
}
