import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-text',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    TooltipModule,
    InputIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputTextComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-text.component.html',
  styleUrl: './form-input-text.component.scss'
})
export class FormInputTextComponent implements ControlValueAccessor {

  //The internal data model
  private innerValue: string | undefined = "";

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor

  @Input() property: string = '';
  @Input() label: string = '';
  @Input() infoMessage: string | undefined = undefined;
  @Input() disabled: boolean = false;
  @Input() obligatory: boolean = false;
  @Input() listaErrori: ErrorsViewModel[] = [];

  @Input() placeholder: string = '';
  @Input() type: string = 'text';

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
