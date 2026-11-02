import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, input, OnChanges, output, SimpleChanges, viewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
    selector: 'ui-date-picker',
    templateUrl: './date-picker.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePickerModule, ErrorMessageComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnChanges {
    inputEl = viewChild('inputEl', { read: ElementRef });

    // ---- Inputs ----
    id = input<string>('');
    label = input<string | null>(null);
    showLabel = input<boolean>(true);
    placeholder = input<string>('');
    required = input<boolean>(false);
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    setNgClass = input<string>('');
    validatorMessage = input<boolean>(true);
    submitted = input<boolean>(false);

    // DatePicker específicos
    showIcon = input<boolean>(true);
    showButtonBar = input<boolean>(true);
    dateFormat = input<string>('dd/mm/yy');
    selectionMode = input<'single' | 'multiple' | 'range'>('single');
    minDate = input<Date | undefined>(undefined);
    maxDate = input<Date | undefined>(undefined);
    showTime = input<boolean>(false);
    hourFormat = input<'12' | '24'>('24');
    appendTo = input<'body' | null>(null);
    readonlyInput = input<boolean>(false);

    // Navegación
    next = input<any>(undefined);
    nextIsDisable = input<any>(undefined);
    back = input<any>(undefined);
    backIsDisable = input<any>(undefined);

    // ---- Outputs ----
    change = output<Date | null>();
    blur = output<Date | null>();
    onNext = output<void>();
    onBack = output<void>();

    controls: AbstractControl | null = null;
    private disabledFromCva = false;
    value: Date | null = null;

    onChange = (_: any) => {};
    onTouched = () => {};
    onValidationChange = () => {};

    get isDisabled(): boolean {
        return this.disabled() || this.disabledFromCva;
    }

    get isInvalid(): boolean {
        if (!this.controls) return false;
        return (this.controls.dirty || this.controls.touched) && !!this.controls.errors;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['submitted'] && this.controls && this.submitted()) {
            this.controls.markAsDirty();
            this.controls.markAsTouched();
        }
    }

    // ---- ControlValueAccessor ----
    writeValue(value: any): void {
        this.value = value ? new Date(value) : null;
        this.onValidationChange();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabledFromCva = isDisabled;
    }

    // ---- Validator ----
    validate(control: AbstractControl): ValidationErrors | any {
        this.controls = control;
        return null;
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onValidationChange = fn;
    }

    // ---- Eventos ----
    focus(): void {
        (this.inputEl()?.nativeElement as HTMLElement)?.querySelector('input')?.focus();
    }

    onSelect(val: Date | null): void {
        this.value = val;
        this.onChange(val);
        this.onValidationChange();
        this.change.emit(val);
    }

    onInputEvent(): void {
        // sincroniza cuando el usuario escribe manualmente
        const val = this.value ?? null;
        this.onChange(val);
        this.onValidationChange();
    }

    onBlur(): void {
        this.onTouched();
        this.onValidationChange();
        this.blur.emit(this.value ?? null);
    }

    private isFieldBlocked(field: any): boolean {
        if (!field) return false;
        const dis = typeof field.disabled === 'function' ? field.disabled() : field.disabled;
        const ro = typeof field.readonly === 'function' ? field.readonly() : field.readonly;
        return !!dis || !!ro;
    }

    enterKeyUp(): void {
        const next = this.next();
        const nextIsDisable = this.nextIsDisable();

        if (next != undefined) {
            if (this.isFieldBlocked(next)) {
                if (nextIsDisable != undefined) nextIsDisable.focus();
            } else {
                next.focus();
            }
        } else {
            if (nextIsDisable != undefined) nextIsDisable.focus();
            else this.onNext.emit();
        }
    }

    arrowLeftKeyUp(): void {
        // No navegar si hay un calendario abierto o el cursor no está al inicio
        const el = this.inputEl()?.nativeElement as HTMLInputElement | undefined;
        if (el && el.selectionStart != null && el.selectionStart > 0) return;

        const back = this.back();
        const backIsDisable = this.backIsDisable();

        if (back != undefined) {
            if (this.isFieldBlocked(back)) {
                if (backIsDisable != undefined) backIsDisable.focus();
            } else {
                back.focus();
            }
        } else {
            if (backIsDisable != undefined) backIsDisable.focus();
            else this.onBack.emit();
        }
    }
}
