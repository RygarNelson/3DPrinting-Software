import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { FormInputGeneralComponent } from '../form-input-general.component';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-radiobutton',
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    TooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputRadiobuttonComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-radiobutton.component.html',
  styleUrl: './form-input-radiobutton.component.scss'
})
export class FormInputRadiobuttonComponent extends FormInputGeneralComponent implements ControlValueAccessor {
  //The internal data model
  private innerValue: any = undefined;

  @Input() name: string = '';
  @Input() radioButtonValue: any = undefined;

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
