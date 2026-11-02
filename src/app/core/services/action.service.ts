import { Injectable } from '@angular/core';
import { Action, ActionDependenciesResponse } from '../../shared/interfaces/config';
import { GenericService } from './generic.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ActionService extends GenericService<Action, number> {
    protected override endpoint = 'actions';

    checkDependencies(actionId: number): Observable<ActionDependenciesResponse> {
        return this.http.get<ApiResponse<ActionDependenciesResponse>>(`${this.url}/${actionId}/dependencies`).pipe(map((res) => res.data));
    }
}
