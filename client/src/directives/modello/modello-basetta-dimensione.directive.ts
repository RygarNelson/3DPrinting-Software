import { Directive, OnInit } from '@angular/core';
import { LookupInterface } from 'src/interfaces/lookup.interface';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Directive({
  selector: '[modello-basetta-dimensione]'
})
export class ModelloBasettaDimensioneDirective implements OnInit {

  constructor(private component: FormInputSelectComponent) { }

  ngOnInit(): void {
    this.component.loading = true;

    /**
     * 
    */
    const data: LookupInterface[] = [
      {
        id: '25mm',
        etichetta: '[Round] 25mm'
      },
      {
        id: '28mm',
        etichetta: '[Round] 28mm'
      },
      {
        id: '28.5mm',
        etichetta: '[Round] 28.5mm'
      },
      {
        id: '32mm',
        etichetta: '[Round] 32mm'
      },
      {
        id: '40mm',
        etichetta: '[Round] 40mm'
      },
      {
        id: '50mm',
        etichetta: '[Round] 50mm'
      },
      {
        id: '60mm',
        etichetta: '[Round] 60mm'
      },
      {
        id: '80mm',
        etichetta: '[Round] 80mm'
      },
      {
        id: '100mm',
        etichetta: '[Round] 100mm'
      },
      {
        id: '130mm',
        etichetta: '[Round] 130mm'
      },
      {
        id: '160mm',
        etichetta: '[Round] 160mm'
      },
      {
        id: '60x35mm',
        etichetta: '[Oval] 60x35mm'
      },
      {
        id: '75x42mm',
        etichetta: '[Oval] 75x42mm'
      },
      {
        id: '90x52mm',
        etichetta: '[Oval] 90x52mm'
      },
      {
        id: '105x70mm',
        etichetta: '[Oval] 105x70mm'
      },
      {
        id: '120x92mm',
        etichetta: '[Oval] 120x92mm'
      },
      {
        id: '170x105mm',
        etichetta: '[Oval] 170x105mm'
      },
      {
        id: '170x109mm',
        etichetta: '[Oval] 170x109mm'
      },
      {
        id: '200x150mm',
        etichetta: '[Oval] 200x150mm'
      }
    ];

    this.component.data = data;
    this.component.loading = false;
  }
}
