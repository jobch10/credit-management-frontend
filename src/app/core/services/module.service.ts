import { Injectable } from '@angular/core';
import { Module } from '../../shared/interfaces/config';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { map, Observable } from 'rxjs';
import { EnumModuleType } from '../../shared/enums';
import { SelectOption } from '../../shared/interfaces/selects';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends GenericService<Module, number> {

  protected override endpoint = 'modules';

  getActionIdsByModule(id: number): Observable<number[]> {
      return this.http.get<ApiResponse<number[]>>(`${this.url}/${id}/action-ids`).pipe(map(res => res.data));
  }

  updateModuleActions(moduleId: number, actionIds: number[]): Observable<Module> {
    return this.http.put<ApiResponse<Module>>(`${this.url}/${moduleId}/actions`,{ actionIds }).pipe(map(res => res.data));
  }

  getModulesByType(type: EnumModuleType): Observable<Module[]> {
    return this.http.get<ApiResponse<Module[]>>(`${this.url}/by-type`, {params: { type }}).pipe(map(res => res.data));
  }

  getModulesWithActions(): Observable<Module[]> {
    return this.http.get<ApiResponse<Module[]>>(`${this.url}/with-actions`).pipe(map(res => res.data));
  }

  getModulesSelectOptionsByType(type: EnumModuleType): Observable<SelectOption<Module>[]> {
    return this.getModulesByType(type).pipe(map(modules => this.mapModulesToSelectOptions(modules)));
  }

  private mapModulesToSelectOptions(modules: Module[]): SelectOption<Module>[] {
    return modules.map((module) => ({
      ...module,
      label: module.name ?? '',
      value: module.id,
    }));
  }
}
