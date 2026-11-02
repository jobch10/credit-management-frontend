import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { LoanService } from '@/app/core/services/loan.service';
import { EnumTagSeverity } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { LoadingService } from '@/app/core/services/loading.service';
import { Loan } from '@/app/shared/models/Loan';
import { Installment } from '@/app/shared/models/Installment';

@Component({
    selector: 'app-loan-detail',
    templateUrl: './loan-detail.component.html',
    imports: [CommonModule, TabsModule, TableModule, ButtonModule, TagModule, FieldsetModule, PageHeaderComponent]
})
export class LoanDetailComponent implements OnInit {
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _loanService = inject(LoanService);
    private readonly _loading = inject(LoadingService);

    readonly loan = signal<Loan | null>(null);
    readonly installments = signal<Installment[]>([]);
    readonly loading = signal(false);

    ngOnInit(): void {
        const id = Number(this._route.snapshot.paramMap.get('id'));
        if (!id) return;
        this.load(id);
    }

    private load(id: number): void {
        this.loading.set(true);
        this._loading.track(this._loanService.getFullLoan(id), 'Cargando crédito...').subscribe({
            next: (res) => {
                this.loan.set(res);
                this.installments.set(res.installments ?? []);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    formatCurrency(v?: number | null): string {
        return v != null ? `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—';
    }

    getSeverity(status: string | null | undefined): EnumTagSeverity {
        switch (status) {
            case 'PAGADA':
                return EnumTagSeverity.SUCCESS;
            case 'PARCIAL':
                return EnumTagSeverity.WARN;
            case 'VENCIDA':
                return EnumTagSeverity.DANGER;
            default:
                return EnumTagSeverity.INFO;
        }
    }

    goBack(): void {
        this._router.navigate(['../'], { relativeTo: this._route });
    }
}
