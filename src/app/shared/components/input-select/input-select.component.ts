import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, OnChanges, output, signal, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Select, SelectModule } from 'primeng/select';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
    selector: 'input-select',
    templateUrl: './input-select.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, ErrorMessageComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputSelectComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputSelectComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class InputSelectComponent implements OnChanges {
    @ViewChild('selectEl') selectEl!: Select;

    // ---- Inputs (signals) ----
    id = input<string>('');
    label = input<string | null>(null);
    showLabel = input<boolean>(true);
    placeholder = input<string>('Seleccione');
    required = input<boolean>(false);
    disabled = input<boolean>(false);
    setNgClass = input<string>('');
    validatorMessage = input<boolean>(true);
    submitted = input<boolean>(false);
    next = input<any>(undefined);
    nextIsDisable = input<any>(undefined);
    back = input<any>(undefined);
    backIsDisable = input<any>(undefined);
    size = input<'small' | 'large'>('large');

    // ---- Props propias del Select ----
    options = input<any[]>([]);
    optionLabel = input<string>('name');
    optionValue = input<string | undefined>(undefined);
    readonly = input<boolean>(false);
    filter = input<boolean>(false);
    filterBy = input<string | undefined>(undefined);
    showClear = input<boolean>(false);
    loading = input<boolean>(false);
    emptyMessage = input<string>('No hay resultados');
    appendTo = input<any>('body');
    scrollHeight = input<string>('200px');

    // ---- Outputs ----
    change = output<any>();
    blur = output<any>();
    onNext = output<void>();
    onBack = output<void>();

    controls: AbstractControl | null = null;
    value: any = null;

    // Lo usamos para saber si el panel está abierto y no pelear con el Enter interno de PrimeNG
    panelOpen = signal(false);

    private disabledFromCva = false;

    onChangeFn = (_: any) => {};
    onTouchedFn = () => {};
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
        this.value = value ?? null;
        this.onValidationChange();
    }

    registerOnChange(fn: any): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedFn = fn;
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
        this.selectEl?.focus?.();
    }

    onSelectChange(val: any): void {
        this.value = val;
        this.onChangeFn(this.value);
        this.onValidationChange();
        this.change.emit(this.value);
    }

    onSelectBlur(): void {
        this.onTouchedFn();
        this.onValidationChange();
        this.blur.emit(this.value);
    }

    enterKeyUp(): void {
        const next = this.next();
        const nextIsDisable = this.nextIsDisable();

        if (next != undefined) {
            if (next.disabled() || next.readonly()) {
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
        if (this.panelOpen()) return;

        const back = this.back();
        const backIsDisable = this.backIsDisable();

        if (back != undefined) {
            if (back.disabled() || back.readonly()) {
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
