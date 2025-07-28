import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormInputGeneralComponent } from '../form-input-general.component';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-checkbox',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    TooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputCheckboxComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-checkbox.component.html',
  styleUrl: './form-input-checkbox.component.scss'
})
export class FormInputCheckboxComponent extends FormInputGeneralComponent implements ControlValueAccessor {

  //The internal data model
  private innerValue: boolean | undefined = undefined;

  @Input() binary: boolean = true;
  @Input() labelPosition: 'left' | 'right' = 'right';

  get value(): boolean | undefined {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: boolean | undefined) {
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