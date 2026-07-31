import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

import { Password, PasswordModule } from 'primeng/password';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
    selector: 'input-password',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PasswordModule, ErrorMessageComponent],
    templateUrl: './input-password.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputPasswordComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputPasswordComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class InputPasswordComponent implements OnChanges {
    @ViewChild('pwd') pwd!: Password;

    /**
     * ID del input (accesibilidad y label for)
     */
    @Input() id: string = '';

    /**
     * Texto de etiqueta superior
     */
    @Input() label: string | null = null;

    /**
     * Mostrar u ocultar la etiqueta
     */
    @Input() showLabel: boolean = true;

    /**
     * Placeholder del campo
     */
    @Input() placeholder: string = '';

    /**
     * Autocomplete del input
     */
    @Input() autocomplete: string = 'current-password';

    /**
     * Asterisco visual de requerido
     */
    @Input() required: boolean = false;

    /**
     * Deshabilita manualmente el componente
     */
    @Input() disabled: boolean = false;

    /**
     * Clases extra
     */
    @Input() setNgClass: string = '';

    /**
     * Muestra errores debajo
     */
    @Input() validatorMessage: boolean = true;

    /**
     * Fuerza mostrar errores (al guardar)
     */
    @Input() submitted: boolean = false;

    // Navegación
    /**
     * Referencia al siguiente control (Enter)
     */
    @Input() next: any;

    /**
     * Alternativa si next está disabled
     */
    @Input() nextIsDisable: any;

    /**
     * Referencia al anterior
     */
    @Input() back: any;

    /**
     * Alternativa si back está disabled
     */
    @Input() backIsDisable: any;

    // Password behavior
    /**
     * Muestra el ojito (toggle) - por defecto true
     */
    @Input() toggleMask: boolean = true;

    /**
     * Muestra panel de fortaleza - por defecto false (login)
     */
    @Input() feedback: boolean = false;

    /**
     * Textos del panel (solo si feedback=true)
     */
    @Input() promptLabel: string = 'Ingrese una contraseña';
    @Input() weakLabel: string = 'Muy simple';
    @Input() mediumLabel: string = 'Complejidad media';
    @Input() strongLabel: string = 'Contraseña fuerte';

    /**
     * Size del input (puede ser 'small', 'medium' o 'large')
     */
    @Input() size: 'small' | 'large' | undefined = undefined;

    // Events
    /**
     * Emit al cambiar valor
     */
    @Output() change = new EventEmitter<string | null>();

    /**
     * Emit en blur
     */
    @Output() blur = new EventEmitter<string | null>();

    /**
     * Cuando no hay next y presionas Enter
     */
    @Output() onNext = new EventEmitter<void>();

    /**
     * Cuando no hay back definido
     */
    @Output() onBack = new EventEmitter<void>();

    controls: AbstractControl | null = null;

    private disabledFromCva = false;
    value: string | null = null;

    onChange = (_: any) => {};
    onTouched = () => {};
    onValidationChange = () => {};

    get isDisabled(): boolean {
        return this.disabled || this.disabledFromCva;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['submitted'] && this.controls && changes['submitted'].currentValue) {
            this.controls.markAsDirty();
            this.controls.markAsTouched();
        }
    }

    // ---- CVA ----
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

    // ---- helpers ----
    focus(): void {
        const el = (this.pwd as any)?.input?.nativeElement as HTMLInputElement | undefined;
        el?.focus();
    }

    onModelChange(val: string): void {
        this.value = val ?? '';
        this.onChange(this.value);
        this.onValidationChange();
        this.change.emit(this.value);
    }

    onBlurInternal(): void {
        this.onTouched();
        this.onValidationChange();
        this.blur.emit(this.value ?? null);
    }

    enterKeyUp(): void {
        if (this.next != undefined) {
            if (this.next.disabled) {
                if (this.nextIsDisable != undefined) this.nextIsDisable.focus();
            } else {
                this.next.focus();
            }
        } else {
            if (this.nextIsDisable != undefined) this.nextIsDisable.focus();
            else this.onNext.emit();
        }
    }

    arrowLeftKeyUp(): void {
        if (this.back != undefined) {
            if (this.back.disabled) {
                if (this.backIsDisable != undefined) this.backIsDisable.focus();
            } else {
                this.back.focus();
            }
        } else {
            if (this.backIsDisable != undefined) this.backIsDisable.focus();
            else this.onBack.emit();
        }
    }

    get isInvalid(): boolean {
        if (!this.controls) return false;
        return (this.controls.dirty || this.controls.touched) && !!this.controls.errors;
    }
}
