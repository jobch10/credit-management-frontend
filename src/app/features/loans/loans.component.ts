import { LoanService } from '@/app/core/services/loan.service';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { EnumAction } from '@/app/shared/enums';
import { Loan } from '@/app/shared/models/Loan';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LOAN_CONFIG } from './loans.config';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';

@Component({
    selector: 'app-loans',
    templateUrl: './loans.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent]
})
export class LoansComponent extends CrudPageBase<Loan> {
    private readonly _loanService = inject(LoanService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    dataKey = LOAN_CONFIG.dataKey;
    globalFilterFields = LOAN_CONFIG.globalFilterFields;
    columns = LOAN_CONFIG.columns;
    subtitle = 'Listado';

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._loanService.findAll();
    }

    protected override deleteFn(id: number) {
        return this._loanService.delete(id);
    }

    protected override getDeleteMessage(row: Loan): string {
        return `¿Está seguro de eliminar el crédito ${row.loanNumber}?`;
    }

    override onAdd(): void {
        this._router.navigate(['new'], { relativeTo: this._route });
    }

    protected mapRowActions(event: { action: string; row: Loan }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this._router.navigate(['edit', event.row.id], { relativeTo: this._route });
                break;
            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;
            case EnumAction.DETALLE_CREDITO:
                this._router.navigate([event.row.id], { relativeTo: this._route });
                break;
        }
    }

    onSaved(): void {
        this.initCrud();
    }
}
