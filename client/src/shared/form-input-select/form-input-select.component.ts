import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { LookupInterface } from 'src/interfaces/lookup.interface';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { ErrorMessagesPipe } from '../pipes/error-messages.pipe';
import { ShowErrorPipe } from '../pipes/show-error.pipe';

@Component({
  selector: 'form-input-select',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TooltipModule,
    ShowErrorPipe,
    ErrorMessagesPipe,
    InputGroupModule,
    InputGroupAddonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputSelectComponent),
      multi: true,
    }
  ],
  templateUrl: './form-input-select.component.html',
  styleUrl: './form-input-select.component.scss'
})
export class FormInputSelectComponent implements ControlValueAccessor {

  @Input() property: string = '';
  @Input() label: string = '';
  @Input() infoMessage: string | undefined = undefined;
  @Input() disabled: boolean = false;
  @Input() obligatory: boolean = false;
  @Input() listaErrori: ErrorsViewModel[] = [];

  @Input() data: LookupInterface[] = [];
  @Input() placeholder: string = '';
  @Input() loading: boolean = false;
  @Input() checkmark: boolean = true;
  @Input() editable: boolean = false;
  @Input() filter: boolean = true;
  @Input() filterBy: string = 'etichetta';
  @Input() showClear: boolean = true;
  @Input() virtualScroll: boolean = true;
  @Input() virtualScrollItemSize: number = 50;
  @Input() showAdd: boolean = false;

  @Output() add = new EventEmitter<void>();

  private innerValue: number | null = null;

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur() {
    this.onTouchedCallback();
  }

  private onTouchedCallback = () => {};
  private onChangeCallback = (_: any) => {};
}
