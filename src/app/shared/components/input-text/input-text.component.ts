import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
    @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

    @Input() id: string = '';
    @Input() label: string | null = null;
    @Input() showLabel: boolean = true;
    @Input() placeholder: string = '';
    @Input() autocomplete: string = 'off';
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;
    @Input() setNgClass: string = '';
    @Input() validatorMessage: boolean = true;
    @Input() submitted: boolean = false;
    @Input() next: any;
    @Input() nextIsDisable: any;
    @Input() back: any;
    @Input() backIsDisable: any;
    @Input() size: 'small' | 'large' = 'large';

    @Output() change = new EventEmitter<string | null>();
    @Output() blur = new EventEmitter<string | null>();
    @Output() onNext = new EventEmitter<void>();
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

    get isInvalid(): boolean {
        if (!this.controls) return false;
        return (this.controls.dirty || this.controls.touched) && !!this.controls.errors;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['submitted'] && this.controls && changes['submitted'].currentValue) {
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
        this.inputEl?.nativeElement?.focus();
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

    enterKeyUp(): void {
        if (this.next != undefined) {
            if (this.next.disabled || this.next.readonly) {
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
            if (this.back.disabled || this.back.readonly) {
                if (this.backIsDisable != undefined) this.backIsDisable.focus();
            } else {
                this.back.focus();
            }
        } else {
            if (this.backIsDisable != undefined) this.backIsDisable.focus();
            else this.onBack.emit();
        }
    }
}
