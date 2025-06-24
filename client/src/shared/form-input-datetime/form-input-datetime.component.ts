import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { FormInputGeneralComponent } from '../form-input-general.component';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-datetime',
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    TooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputDatetimeComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-datetime.component.html',
  styleUrl: './form-input-datetime.component.scss'
})
export class FormInputDatetimeComponent extends FormInputGeneralComponent implements ControlValueAccessor {
  
  //The internal data model
  private innerValue: Date | undefined = undefined;

  @Input() format: string = 'dd/MM/yy';
  @Input() showOnFocus: boolean = true;

  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      if (v) {
        this.innerValue = new Date(v);
      } else {
        this.innerValue = undefined;
      }

      this.onChangeCallback(this.innerValue);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      if (value) {
        this.innerValue = new Date(value);
      } else {
        this.innerValue = undefined;
      }
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
