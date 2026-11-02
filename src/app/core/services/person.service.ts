import { Person } from '@/app/shared/models';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class PersonService extends GenericService<Person, number> {
    protected override endpoint = 'persons';

    findInReniec(dni: string): Observable<Person> {
        return this.http.get<ApiResponse<Person>>(`${this.url}/reniec/${dni}`).pipe(map((res) => res.data));
    }
}
