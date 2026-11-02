import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, input, output, viewChild, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
    selector: 'input-text',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ErrorMessageComponent],
    templateUrl: './input-text.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputTextComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class InputTextComponent implements OnChanges {
    inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

    // ---- Inputs (signals) ----
    id = input<string>('');
    label = input<string | null>(null);
    showLabel = input<boolean>(true);
    placeholder = input<string>('');
    autocomplete = input<string>('off');
    required = input<boolean>(false);
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    setNgClass = input<string>('');
    validatorMessage = input<boolean>(true);
    submitted = input<boolean>(false);
    next = input<any>(undefined);
    nextIsDisable = input<any>(undefined);
    back = input<any>(undefined);
    backIsDisable = input<any>(undefined);
    size = input<'small' | 'large'>('large');

    // ---- Outputs ----
    change = output<string | null>();
    blur = output<string | null>();
    onNext = output<void>();
    onBack = output<void>();
    onEnter = output<string | null>();

    controls: AbstractControl | null = null;

    private disabledFromCva = false;

    value: string | null = null;

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
        this.value = value == null ? null : String(value);
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

    onInput(val: string): void {
        this.value = val ?? '';
        this.onChange(this.value);
        this.onValidationChange();
        this.change.emit(this.value);
    }

    onBlur(val: string): void {
        this.onTouched();
        this.onValidationChange();
        this.blur.emit(val ?? null);
    }

    // ---- Helper para leer disabled/readonly sin importar si es signal o propiedad plana ----
    private isFieldBlocked(field: any): boolean {
        if (!field) return false;
        const dis = typeof field.disabled === 'function' ? field.disabled() : field.disabled;
        const ro = typeof field.readonly === 'function' ? field.readonly() : field.readonly;
        return !!dis || !!ro;
    }

    enterKeyUp(): void {
        const next = this.next();
        const nextIsDisable = this.nextIsDisable();

        this.onEnter.emit(this.value);

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
