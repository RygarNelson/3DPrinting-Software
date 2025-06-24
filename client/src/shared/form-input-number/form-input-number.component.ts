import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { FormInputGeneralComponent } from '../form-input-general.component';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-number',
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    TooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputNumberComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-number.component.html',
  styleUrl: './form-input-number.component.scss'
})
export class FormInputNumberComponent extends FormInputGeneralComponent implements ControlValueAccessor {

  //The internal data model
  private innerValue: number | undefined = undefined;

  @Input() min: number | undefined = undefined;
  @Input() max: number | undefined = undefined;
  @Input() step: number | undefined = undefined;
  @Input() mode: 'decimal' | 'currency' | 'percent' = 'decimal';
  @Input() minFractionDigits: number | undefined = undefined;
  @Input() maxFractionDigits: number | undefined = undefined;
  @Input() currency: string | undefined = undefined;
  @Input() currencyDisplay: 'symbol' | 'code' | 'name' = 'symbol';
  @Input() prefix: string | undefined = undefined;
  @Input() suffix: string | undefined = undefined;
  @Input() showButtons: boolean = true;

  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private onTouchedCallback = () => {};
  private onChangeCallback = (_: any) => {};
}
