import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { CrudFormBase } from '@/app/shared/class/CrudFormBase';
import { DatePickerComponent } from '@/app/shared/components/date-picker/date-picker.component';
import { InputNumberComponent } from '@/app/shared/components/input-number/input-number.component';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';

import { FinancialSubjectService } from '@/app/core/services/financial-subject.service';
import { LoanService } from '@/app/core/services/loan.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { EnumGuaranteeType, EnumPaymentFrequency } from '@/app/shared/enums';
import { Loan } from '@/app/shared/models/Loan';
import { GUARANTEE_TYPE_OPTIONS, PAYMENT_FREQUENCY_OPTIONS } from '../loans.constans';

@Component({
    selector: 'app-loan-form',
    templateUrl: './loan-form.component.html',
    imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, InputTextComponent, InputSelectComponent, InputNumberComponent, DatePickerComponent, ButtonModule, FieldsetModule]
})
export class LoanFormComponent extends CrudFormBase<Loan> {
    private readonly _fb = inject(FormBuilder);
    protected override service = inject(LoanService);
    private readonly _subjectService = inject(FinancialSubjectService);
    private readonly _loading = inject(LoadingService);

    protected override createIconClass = 'pi pi-wallet';
    protected override editIconClass = 'pi pi-wallet';

    readonly frequencyOptions = PAYMENT_FREQUENCY_OPTIONS;
    readonly guaranteeOptions = GUARANTEE_TYPE_OPTIONS;

    readonly borrowers = toSignal(this._subjectService.findBorrowerPersons(), { initialValue: [] });
    readonly investors = toSignal(this._subjectService.findInvestorPersons(), { initialValue: [] });

    readonly calculated = signal<Loan | null>(null);
    readonly calculating = signal(false);

    form!: FormGroup;

    protected override onInitForm(): void {
        this.form = this._fb.group({
            loanNumber: ['', [Validators.required, Validators.maxLength(20)]],
            borrowerSubjectId: [null as number | null, [Validators.required]],
            principalAmount: [0, [Validators.required, Validators.min(1)]],
            interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            termMonths: [1, [Validators.required, Validators.min(1)]],
            paymentFrequency: [EnumPaymentFrequency.MENSUAL, [Validators.required]],
            startDate: [new Date(), [Validators.required]],
            guaranteeType: [EnumGuaranteeType.SIN_GARANTIA],
            guaranteeDescription: [''],
            notes: [''],

            // Inversionista
            investorSubjectId: [null as number | null, [Validators.required]],
            expectedRate: [null as number | null, [Validators.min(0), Validators.max(100)]]
        });
    }

    protected override patchForm(loan: Loan): void {
        const funding = loan.fundings?.[0];
        this.form.patchValue({
            loanNumber: loan.loanNumber,
            borrowerSubjectId: loan.borrowerSubjectId,
            principalAmount: loan.principalAmount,
            interestRate: loan.interestRate,
            termMonths: loan.termMonths,
            paymentFrequency: loan.paymentFrequency,
            startDate: loan.startDate ? new Date(loan.startDate) : null,
            guaranteeType: loan.guaranteeType,
            guaranteeDescription: loan.guaranteeDescription ?? '',
            notes: loan.notes ?? '',

            investorSubjectId: funding?.investorSubjectId ?? null,
            expectedRate: funding?.expectedRate ?? null
        });
    }

    protected override getPayload(): Loan {
        const v = this.form.getRawValue();
        return {
            ...v,
            startDate: this.formatDate(v.startDate),
            guaranteeDescription: v.guaranteeDescription || null,
            notes: v.notes || null,
            fundings: v.investorSubjectId
                ? [
                      {
                          investorSubjectId: v.investorSubjectId,
                          fundedAmount: v.principalAmount,
                          fundedPercentage: 100,
                          expectedRate: v.expectedRate
                      }
                  ]
                : []
        } as Loan;
    }

    protected override isInvalidForm(): boolean {
        return this.form.invalid;
    }

    protected override markFormTouched(): void {
        this.form.markAllAsTouched();
    }

    /** Calcula cuota, interés y total sin guardar */
    public calcular(): void {
        if (this.form.invalid) {
            this.markFormTouched();
            return;
        }
        this.calculating.set(true);
        this._loading.track(this.service.calculate(this.getPayload()), 'Calculando...').subscribe({
            next: (res) => {
                this.calculated.set(res);
                this.calculating.set(false);
            },
            error: () => this.calculating.set(false)
        });
    }

    public override save(): void {
        if (this.form.invalid) {
            this.markFormTouched();
            return;
        }
        const payload = this.getPayload();
        const id = this.entityId();

        this.saving.set(true);
        const request$ = id ? this.service.update(id, payload) : this.service.createLoan(payload);

        request$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: () => this.goBack(),
            error: (err) => this.onSaveError(err)
        });
    }

    public formatCurrency(v?: number | null): string {
        return v != null ? `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—';
    }

    private formatDate(d: Date | string): string {
        if (typeof d === 'string') return d;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
}
