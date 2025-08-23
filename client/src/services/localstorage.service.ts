import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  clear(): void {
    localStorage.clear();
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  getObject(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  setObject(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
