import { FinancialSubjectService } from '@/app/core/services/financial-subject.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { PersonService } from '@/app/core/services/person.service';
import { CrudFormBase } from '@/app/shared/class/CrudFormBase';
import { DatePickerComponent } from '@/app/shared/components/date-picker/date-picker.component';
import { InputNumberComponent } from '@/app/shared/components/input-number/input-number.component';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { EnumMaritalStatus, EnumRiskTolerance, EnumSubjectRole, EnumSubjectStatus, EnumSubjectType } from '@/app/shared/enums';
import { FinancialSubject } from '@/app/shared/models';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from 'primeng/tabs';
import { finalize } from 'rxjs';
import { MARITAL_STATUS_OPTIONS, RISK_TOLERANCE_OPTIONS, STATUS_OPTIONS } from '../../../constants';

@Component({
    selector: 'app-investor-person-form',
    templateUrl: './investor-person-form.component.html',
    imports: [TabsModule, PageHeaderComponent, FieldsetModule, CommonModule, ReactiveFormsModule, InputSelectComponent, InputTextComponent, InputNumberComponent, DatePickerComponent, ButtonModule]
})
export class InvestorPersonFormComponent extends CrudFormBase<FinancialSubject> {
    private readonly _fb = inject(FormBuilder);
    protected override service = inject(FinancialSubjectService);
    private readonly _personService = inject(PersonService);
    private readonly _loading = inject(LoadingService);

    protected override createIconClass = 'pi pi-briefcase';
    protected override editIconClass = 'pi pi-briefcase';

    readonly statusOptions = STATUS_OPTIONS;
    readonly maritalStatusOptions = MARITAL_STATUS_OPTIONS;
    readonly riskToleranceOptions = RISK_TOLERANCE_OPTIONS;

    readonly today = new Date();

    form!: FormGroup;

    protected override loadEntity(id: number): void {
        this.pageLoading.set(true);
        this.service
            .getFullSubject(id)
            .pipe(finalize(() => this.pageLoading.set(false)))
            .subscribe({
                next: (entity) => {
                    this.entity.set(entity);
                    this.patchForm(entity);
                },
                error: (err) => this.onLoadError(err)
            });
    }

    protected override onInitForm(): void {
        this.form = this._fb.group({
            // Subject
            status: [EnumSubjectStatus.ACTIVO, [Validators.required]],
            address: ['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.email, Validators.maxLength(100)]],
            phoneNumber: ['', [Validators.maxLength(15)]],

            // Person
            dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            lastName: ['', [Validators.required, Validators.maxLength(100)]],
            birthDate: [null as Date | null, [Validators.required]],
            maritalStatus: [EnumMaritalStatus.SOLTERO, [Validators.required]],

            // InvestorProfile
            investmentCapacity: [0, [Validators.required, Validators.min(0)]],
            preferredRate: [null as number | null, [Validators.min(0), Validators.max(100)]],
            preferredTermMonths: [null as number | null, [Validators.min(1)]],
            riskTolerance: [EnumRiskTolerance.MODERADO],
            bankName: ['', [Validators.maxLength(100)]],
            bankAccount: ['', [Validators.maxLength(30)]],
            notes: ['', [Validators.maxLength(1000)]]
        });
    }

    protected override patchForm(subject: FinancialSubject): void {
        const p = subject.person;
        const ip = subject.investorProfile;
        this.form.patchValue({
            status: subject.status,
            address: subject.address,
            email: subject.email ?? '',
            phoneNumber: subject.phoneNumber ?? '',

            dni: p?.dni ?? '',
            firstName: p?.firstName ?? '',
            lastName: p?.lastName ?? '',
            birthDate: p?.birthDate ? new Date(p.birthDate) : null,
            maritalStatus: p?.maritalStatus as EnumMaritalStatus,

            investmentCapacity: ip?.investmentCapacity ?? 0,
            preferredRate: ip?.preferredRate ?? null,
            preferredTermMonths: ip?.preferredTermMonths ?? null,
            riskTolerance: ip?.riskTolerance ?? EnumRiskTolerance.MODERADO,
            bankName: ip?.bankName ?? '',
            bankAccount: ip?.bankAccount ?? '',
            notes: ip?.notes ?? ''
        });
    }

    protected override getPayload(): FinancialSubject {
        const v = this.form.getRawValue();
        const e = this.entity();

        const payload: FinancialSubject = {
            id: e?.id,
            subjectType: EnumSubjectType.PERSONA,
            status: v.status,
            address: v.address,
            email: v.email,
            phoneNumber: v.phoneNumber,

            person: {
                id: e?.person?.id,
                financialSubjectId: e?.person?.financialSubjectId,
                dni: v.dni,
                firstName: v.firstName,
                lastName: v.lastName,
                birthDate: v.birthDate ? this.formatDate(v.birthDate) : '',
                maritalStatus: v.maritalStatus!
            },

            investorProfile: {
                id: e?.investorProfile?.id,
                financialSubjectId: e?.investorProfile?.financialSubjectId,
                investmentCapacity: v.investmentCapacity,
                preferredRate: v.preferredRate,
                preferredTermMonths: v.preferredTermMonths,
                riskTolerance: v.riskTolerance,
                bankName: v.bankName,
                bankAccount: v.bankAccount,
                notes: v.notes
            }
        };

        if (!e?.id) {
            payload.roles = [{ role: EnumSubjectRole.INVERSIONISTA }];
        }
        return payload;
    }

    protected override isInvalidForm(): boolean {
        return this.form.invalid;
    }

    protected override markFormTouched(): void {
        this.form.markAllAsTouched();
    }

    public obtenerDatos(): void {
        const dni = this.form.get('dni')?.value;
        if (!dni) return;
        this._loading.track(this._personService.findInReniec(dni), 'Consultando RENIEC...').subscribe((person) => {
            this.form.patchValue({
                firstName: person.firstName,
                lastName: person.lastName
            });
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

        const request$ = id ? this.service.updatePersonSubject(id, payload) : this.service.createPersonSubject(payload);

        request$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: () => this.goBack(),
            error: (err) => this.onSaveError(err)
        });
    }

    private formatDate(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
}
