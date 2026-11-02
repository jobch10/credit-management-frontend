import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { DocumentManagerComponent } from '@/app/shared/components/document-manager/document-manager.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';
import { EnumAction } from '@/app/shared/enums';
import { FinancialSubject } from '@/app/shared/models';
import { FinancialSubjectService } from '@/app/core/services/financial-subject.service';
import { INVESTOR_PERSONS_CONFIG } from './investor-persons.config';

@Component({
    selector: 'app-investor-persons',
    templateUrl: './investor-persons.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent, DocumentManagerComponent]
})
export class InvestorPersonsComponent extends CrudPageBase<FinancialSubject> {
    private readonly _subjectService = inject(FinancialSubjectService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    dataKey = INVESTOR_PERSONS_CONFIG.dataKey;
    globalFilterFields = INVESTOR_PERSONS_CONFIG.globalFilterFields;
    columns = INVESTOR_PERSONS_CONFIG.columns;
    subtitle = 'Listado';

    documentModalVisible = signal(false);
    selectedClientId = signal<number>(0);
    selectedClientName = signal<string>('');

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._subjectService.findInvestorPersons();
    }

    protected override deleteFn(id: number) {
        return this._subjectService.delete(id);
    }

    protected override getDeleteMessage(row: FinancialSubject): string {
        const name = `${row.person?.firstName ?? ''} ${row.person?.lastName ?? ''}`.trim();
        return `¿Está seguro de que desea eliminar al inversionista ${name || row.person?.dni}?`;
    }

    override onAdd(): void {
        this._router.navigate(['register-investor-person'], { relativeTo: this._route });
    }

    protected mapRowActions(event: { action: string; row: FinancialSubject }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this._router.navigate(['edit-investor-person', event.row.id], { relativeTo: this._route });
                break;

            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;

            case EnumAction.CARGAR_DOCUMENTOS:
                this.selectedClientId.set(event.row.id!);
                const name = `${event.row.person?.firstName ?? ''} ${event.row.person?.lastName ?? ''}`.trim();
                this.selectedClientName.set(name || event.row.person?.dni || '');
                this.documentModalVisible.set(true);
                break;
        }
    }

    onSaved(): void {
        this.initCrud();
    }
}
