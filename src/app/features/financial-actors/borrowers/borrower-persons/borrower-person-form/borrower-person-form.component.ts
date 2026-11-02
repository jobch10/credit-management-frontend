import { FinancialSubjectService } from '@/app/core/services/financial-subject.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { PersonService } from '@/app/core/services/person.service';
import { CrudFormBase } from '@/app/shared/class/CrudFormBase';
import { DatePickerComponent } from '@/app/shared/components/date-picker/date-picker.component';
import { InputNumberComponent } from '@/app/shared/components/input-number/input-number.component';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { EnumEmploymentType, EnumHousingType, EnumInfocorpStatus, EnumMaritalStatus, EnumRiskLevel, EnumSubjectRole, EnumSubjectStatus, EnumSubjectType } from '@/app/shared/enums';
import { FinancialSubject } from '@/app/shared/models';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TabsModule } from 'primeng/tabs';
import { EMPLOYMENT_TYPE_OPTIONS, HOUSING_TYPE_OPTIONS, INFOCORP_STATUS_OPTIONS, MARITAL_STATUS_OPTIONS, STATUS_OPTIONS, YES_NO_OPTIONS } from '../../../constants';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-borrower-person-form',
    templateUrl: './borrower-person-form.component.html',
    imports: [TabsModule, PageHeaderComponent, FieldsetModule, CommonModule, ReactiveFormsModule, InputSelectComponent, InputTextComponent, InputNumberComponent, DatePickerComponent, ButtonModule]
})
export class BorrowerPersonFormComponent extends CrudFormBase<FinancialSubject> {
    private readonly _fb = inject(FormBuilder);
    protected override service = inject(FinancialSubjectService);
    private readonly _personService = inject(PersonService);
    private readonly _loading = inject(LoadingService);

    protected override createIconClass = 'pi pi-user-plus';
    protected override editIconClass = 'pi pi-user-edit';

    readonly statusOptions = STATUS_OPTIONS;
    readonly maritalStatusOptions = MARITAL_STATUS_OPTIONS;
    readonly housingTypeOptions = HOUSING_TYPE_OPTIONS;
    readonly employmentTypeOptions = EMPLOYMENT_TYPE_OPTIONS;
    readonly infocorpStatusOptions = INFOCORP_STATUS_OPTIONS;
    readonly yesNoOptions = YES_NO_OPTIONS;

    readonly today = new Date();

    evaluating = signal(false);

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

            // CreditProfile - familia
            dependentsCount: [0, [Validators.required, Validators.min(0)]],
            housingType: [EnumHousingType.PROPIA, [Validators.required]],

            // CreditProfile - economía
            monthlyIncome: [0, [Validators.required, Validators.min(0)]],
            fixedExpenses: [0, [Validators.required, Validators.min(0)]],
            externalDebtPayments: [0, [Validators.required, Validators.min(0)]],

            // CreditProfile - situación laboral
            occupation: ['', [Validators.maxLength(100)]],
            employer: ['', [Validators.maxLength(150)]],
            workSeniorityMonths: [0, [Validators.min(0)]],
            employmentType: [EnumEmploymentType.DEPENDIENTE],

            // CreditProfile - verificación externa
            infocorpStatus: [EnumInfocorpStatus.NORMAL],
            infocorpScore: [0, [Validators.min(0), Validators.max(999)]],
            hasPoliceRecords: [false],
            hasJudicialRecords: [false],
            hasCriminalRecords: [false],

            // Resultados (solo lectura)
            creditScore: [{ value: 0, disabled: true }],
            riskLevel: [{ value: null as EnumRiskLevel | null, disabled: true }]
        });
    }

    protected override patchForm(subject: FinancialSubject): void {
        const p = subject.creditProfile;
        this.form.patchValue({
            status: subject.status,
            address: subject.address,
            email: subject.email ?? '',
            phoneNumber: subject.phoneNumber ?? '',

            dni: subject.person?.dni ?? '',
            firstName: subject.person?.firstName ?? '',
            lastName: subject.person?.lastName ?? '',
            birthDate: subject.person?.birthDate ? new Date(subject.person.birthDate) : null,
            maritalStatus: subject.person?.maritalStatus as EnumMaritalStatus,

            dependentsCount: p?.dependentsCount ?? 0,
            housingType: p?.housingType as EnumHousingType,
            monthlyIncome: p?.monthlyIncome ?? 0,
            fixedExpenses: p?.fixedExpenses ?? 0,
            externalDebtPayments: p?.externalDebtPayments ?? 0,

            occupation: p?.occupation ?? '',
            employer: p?.employer ?? '',
            workSeniorityMonths: p?.workSeniorityMonths ?? 0,
            employmentType: p?.employmentType ?? EnumEmploymentType.DEPENDIENTE,

            infocorpStatus: p?.infocorpStatus ?? EnumInfocorpStatus.NORMAL,
            infocorpScore: p?.infocorpScore ?? 0,
            hasPoliceRecords: p?.hasPoliceRecords ?? false,
            hasJudicialRecords: p?.hasJudicialRecords ?? false,
            hasCriminalRecords: p?.hasCriminalRecords ?? false,

            creditScore: p?.creditScore ?? 0,
            riskLevel: p?.riskLevel ?? null
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

            creditProfile: {
                id: e?.creditProfile?.id,
                financialSubjectId: e?.creditProfile?.financialSubjectId,
                dependentsCount: v.dependentsCount,
                housingType: v.housingType,
                monthlyIncome: v.monthlyIncome,
                fixedExpenses: v.fixedExpenses,
                externalDebtPayments: v.externalDebtPayments,
                occupation: v.occupation,
                employer: v.employer,
                workSeniorityMonths: v.workSeniorityMonths,
                employmentType: v.employmentType,
                infocorpStatus: v.infocorpStatus,
                infocorpScore: v.infocorpScore,
                hasPoliceRecords: v.hasPoliceRecords,
                hasJudicialRecords: v.hasJudicialRecords,
                hasCriminalRecords: v.hasCriminalRecords
            }
        };
        if (!e?.id) {
            payload.roles = [{ role: EnumSubjectRole.PRESTATARIO }];
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

    /** Envía el perfil al backend para calcular score y riesgo */
    public evaluarCredito(): void {
        if (this.form.invalid) {
            this.markFormTouched();
            return;
        }

        this._loading.track(this.service.evaluate(this.getPayload()), 'Evaluando perfil...').subscribe({
            next: (res) => {
                this.form.patchValue({
                    creditScore: res.creditProfile?.creditScore ?? 0,
                    riskLevel: res.creditProfile?.riskLevel as EnumRiskLevel
                });
            }
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
