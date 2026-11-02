import { SelectOption } from '@/app/shared/interfaces/selects';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TypeDocument } from '../../shared/interfaces/actors';
import { GenericService } from './generic.service';

@Injectable({
    providedIn: 'root'
})
export class TypeDocumentService extends GenericService<TypeDocument, number> {
    protected override endpoint = 'type-documents';

    findAllOptions(): Observable<SelectOption<TypeDocument>[]> {
        return this.findAll().pipe(map((types) => this.mapTypeDocumentToSelectOptions(types)));
    }

    private mapTypeDocumentToSelectOptions(types: TypeDocument[]): SelectOption<TypeDocument>[] {
        return types.map((type) => ({
            ...type,
            label: `${type.code} - ${type.name}`,
            value: type.id
        }));
    }
}
