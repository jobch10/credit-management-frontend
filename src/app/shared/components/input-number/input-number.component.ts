import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, input, output, viewChild, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
    selector: 'ui-input-number',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputNumberModule, ErrorMessageComponent],
    templateUrl: './input-number.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class InputNumberComponent implements OnChanges {
    inputEl = viewChild<ElementRef<any>>('inputEl');

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
    currency = input<string | undefined>(undefined);

    // InputNumber específicos
    mode = input<'decimal' | 'currency'>('decimal');
    min = input<number | undefined>(undefined);
    max = input<number | undefined>(undefined);
    showButtons = input<boolean>(false);
    useGrouping = input<boolean>(true);
    minFractionDigits = input<number | undefined>(undefined);
    maxFractionDigits = input<number | undefined>(undefined);
    prefix = input<string | undefined>(undefined);
    suffix = input<string | undefined>(undefined);

    // Navegación
    next = input<any>(undefined);
    nextIsDisable = input<any>(undefined);
    back = input<any>(undefined);
    backIsDisable = input<any>(undefined);

    // ---- Outputs ----
    change = output<number | null>();
    blur = output<number | null>();
    onNext = output<void>();
    onBack = output<void>();

    controls: AbstractControl | null = null;
    private disabledFromCva = false;
    value: number | null = null;

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
        this.value = value == null || value === '' ? null : Number(value);
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
        this.inputEl()?.nativeElement?.focus();
    }

    onInput(val: number | null): void {
        this.value = val;
        this.onChange(val);
        this.onValidationChange();
        this.change.emit(val);
    }

    onBlur(val: number | null): void {
        this.onTouched();
        this.onValidationChange();
        this.blur.emit(val ?? null);
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
        // No navegar si el cursor no está al inicio del input
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
