import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role } from '../../shared/interfaces/config';
import { SelectOption } from '../../shared/interfaces/selects';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role, number> {

  protected override endpoint = 'roles';

  findAllOptions(): Observable<SelectOption<Role>[]> {
    return this.findAll().pipe(map((roles) => this.mapRolesToSelectOptions(roles)));
  }

  getRolePermissions(roleId: number): Observable<Role> {
    return this.http.get<ApiResponse<Role>>(`${this.url}/${roleId}/permisos`).pipe(map((res) => res.data));
  }

  assignPermissions(roleId: number, payload: { moduloId: number; accionId: number[] }[]): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(`${this.url}/${roleId}/permisos`, payload).pipe(map((res) => res.data));
  }

  private mapRolesToSelectOptions(roles: Role[]): SelectOption<Role>[] {
    return roles.map((role) => ({
      ...role,
      label: role.name ?? '',
      value: role.id,
    }));
  }
}
