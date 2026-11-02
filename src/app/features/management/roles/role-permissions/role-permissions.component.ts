import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, switchMap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { RoleService } from '@/app/core/services/role.service';
import { ModuleService } from '@/app/core/services/module.service';
import { AuthStore } from '@/app/core/store/auth.store';

import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';

import { SelectOption } from '@/app/shared/interfaces/selects';
import { Action, Module, Role } from '@/app/shared/interfaces/config';
import { EnumModuleType } from '@/app/shared/enums';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';

type ActionPermissionView = Action & {
    checked: boolean;
};

type ModulePermissionView = Omit<Module, 'children' | 'actions'> & {
    checked: boolean;
    actions: ActionPermissionView[];
};

type GroupPermissionView = {
    id: number | string;
    name: string;
    code: string;
    icon?: string | null;
    type: EnumModuleType;
    children: ModulePermissionView[];
};

@Component({
    selector: 'app-role-permissions',
    templateUrl: './role-permissions.component.html',
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule, PageHeaderComponent, InputSelectComponent, ToolbarModule, IconFieldModule, InputIconModule, TagModule]
})
export class RolePermissionsComponent implements OnInit {
    private readonly _roleService = inject(RoleService);
    private readonly _moduleService = inject(ModuleService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _messageService = inject(MessageService);
    protected readonly _router = inject(Router);
    private readonly _authStore = inject(AuthStore);

    // Título/subtítulo/icono vienen del módulo actual (AuthStore)
    readonly module = computed(() => this._authStore.currentModule());
    title = 'Gestión de permisos';
    description = 'Asigna módulos y acciones por grupo a un rol.';
    iconClass = 'pi pi-shield';

    roles = toSignal(this._roleService.findAllOptions(), {
        initialValue: [] as SelectOption<Role>[]
    });
    selectedRoleId = signal<number | null>(null);

    loading = signal(false);
    saving = signal(false);

    searchGroup = signal('');
    searchModule = signal('');

    allModules = signal<ModulePermissionView[]>([]);
    selectedGroupId = signal<number | string | null>(null);

    readonly groups = computed<GroupPermissionView[]>(() => {
        const modules = this.allModules();

        const groupModules = modules.filter((m) => m.type === EnumModuleType.GRUPO && !!m.state);
        const childModules = modules.filter((m) => m.type === EnumModuleType.MODULO && !!m.state);

        const groups: GroupPermissionView[] = groupModules
            .map((group) => {
                const children = childModules.filter((child) => child.parentId === group.id).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

                return {
                    id: group.id,
                    name: group.name,
                    code: group.code,
                    icon: group.icon,
                    type: EnumModuleType.GRUPO,
                    children
                };
            })
            .filter((group) => group.children.length > 0);

        const independentModules = childModules.filter((child) => !child.parentId).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

        if (independentModules.length > 0) {
            groups.push({
                id: 'independent',
                name: 'Módulos independientes',
                code: 'INDEPENDIENTES',
                icon: 'fa-layer-group',
                type: EnumModuleType.GRUPO,
                children: independentModules
            });
        }

        return groups.sort((a, b) => a.name.localeCompare(b.name));
    });

    readonly filteredGroups = computed<GroupPermissionView[]>(() => {
        const term = this.searchGroup().trim().toLowerCase();
        if (!term) return this.groups();

        return this.groups().filter((group) => {
            const matchGroup = (group.name ?? '').toLowerCase().includes(term) || (group.code ?? '').toLowerCase().includes(term);

            const matchChildren = group.children.some((child) => (child.name ?? '').toLowerCase().includes(term) || (child.code ?? '').toLowerCase().includes(term));

            return matchGroup || matchChildren;
        });
    });

    readonly selectedGroup = computed<GroupPermissionView | null>(() => {
        const currentId = this.selectedGroupId();
        if (currentId == null) return null;
        return this.groups().find((group) => group.id === currentId) ?? null;
    });

    readonly visibleModulesOfSelectedGroup = computed<ModulePermissionView[]>(() => {
        const group = this.selectedGroup();
        if (!group) return [];

        const term = this.searchModule().trim().toLowerCase();
        if (!term) return group.children;

        return group.children.filter(
            (module) =>
                (module.name ?? '').toLowerCase().includes(term) ||
                (module.code ?? '').toLowerCase().includes(term) ||
                (module.actions ?? []).some((action) => (action.name ?? '').toLowerCase().includes(term) || (action.code ?? '').toLowerCase().includes(term))
        );
    });

    ngOnInit(): void {
        const idParam = this._route.snapshot.paramMap.get('id');
        const roleId = idParam ? Number(idParam) : null;

        if (roleId) {
            this.selectedRoleId.set(roleId);
        }

        this._loadData(roleId);
    }

    private _loadData(roleId?: number | null): void {
        this.loading.set(true);

        const requests: {
            catalog: Observable<Module[]>;
            role?: Observable<Role>;
        } = {
            catalog: this._moduleService.getModulesWithActions()
        };

        if (roleId) {
            requests.role = this._roleService.getRolePermissions(roleId);
        }

        forkJoin(requests).subscribe({
            next: ({ catalog, role }) => {
                const mapped = catalog.map((module) => this._mapModuleToPermissionView(module));
                this.allModules.set(mapped);

                if (role) this._applyRolePermissions(role);

                this._ensureSelectedGroup();
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error al cargar permisos', error);
                this.loading.set(false);
            }
        });
    }

    private _mapModuleToPermissionView(module: Module): ModulePermissionView {
        return {
            ...module,
            checked: false,
            actions: (module.actions ?? []).map((action) => ({
                ...action,
                checked: false
            }))
        };
    }

    private _applyRolePermissions(role: Role): void {
        const assignedMap = this._extractAssignedPermissions(role);

        this.allModules.update((modules) =>
            modules.map((module) => {
                const selectedActionIds = assignedMap.get(module.id) ?? new Set<number>();
                const nextActions = (module.actions ?? []).map((action) => ({
                    ...action,
                    checked: !!action.id && selectedActionIds.has(action.id)
                }));

                return {
                    ...module,
                    checked: nextActions.some((action) => action.checked),
                    actions: nextActions
                };
            })
        );
    }

    private _extractAssignedPermissions(role: Role): Map<number, Set<number>> {
        const map = new Map<number, Set<number>>();
        const rawModules = (role as any)?.modules ?? [];

        for (const item of rawModules) {
            const moduleSource = item?.module ?? item;
            const moduleId = moduleSource?.id;
            if (!moduleId) continue;

            const actions = moduleSource?.actions ?? [];
            const actionIds = actions.map((action: any) => action?.id).filter((id: number | null | undefined): id is number => !!id);

            map.set(moduleId, new Set<number>(actionIds));
        }

        return map;
    }

    private _ensureSelectedGroup(): void {
        const groups = this.groups();
        if (!groups.length) {
            this.selectedGroupId.set(null);
            return;
        }

        const current = this.selectedGroupId();
        const exists = groups.some((group) => group.id === current);
        if (exists) return;

        const firstWithSelection = groups.find((group) => group.children.some((child) => child.checked));

        this.selectedGroupId.set(firstWithSelection?.id ?? groups[0].id);
    }

    onRoleChange(roleId: number): void {
        if (!roleId) return;
        this.selectedRoleId.set(roleId);
        this._loadData(roleId);
    }

    selectGroup(group: GroupPermissionView): void {
        this.selectedGroupId.set(group.id);
    }

    isGroupChecked(group: GroupPermissionView): boolean {
        return group.children.length > 0 && group.children.every((child) => child.checked);
    }

    isGroupIndeterminate(group: GroupPermissionView): boolean {
        const checkedCount = group.children.filter((child) => child.checked).length;
        return checkedCount > 0 && checkedCount < group.children.length;
    }

    countCheckedModules(group: GroupPermissionView): number {
        return group.children.filter((child) => child.checked).length;
    }

    countCheckedActions(group: GroupPermissionView): number {
        return group.children.reduce((acc, module) => acc + module.actions.filter((action) => action.checked).length, 0);
    }

    onToggleGroup(group: GroupPermissionView, checked: boolean): void {
        const childIds = new Set(group.children.map((child) => child.id));

        this.allModules.update((modules) =>
            modules.map((module) => {
                if (!childIds.has(module.id)) return module;

                return {
                    ...module,
                    checked,
                    actions: (module.actions ?? []).map((action) => ({
                        ...action,
                        checked
                    }))
                };
            })
        );
    }

    onToggleModule(module: ModulePermissionView, checked: boolean): void {
        this.allModules.update((modules) =>
            modules.map((item) => {
                if (item.id !== module.id) return item;

                return {
                    ...item,
                    checked,
                    actions: (item.actions ?? []).map((action) => ({
                        ...action,
                        checked
                    }))
                };
            })
        );
    }

    onToggleAction(module: ModulePermissionView, action: ActionPermissionView, checked: boolean): void {
        this.allModules.update((modules) =>
            modules.map((item) => {
                if (item.id !== module.id) return item;

                const nextActions = item.actions.map((currentAction) => (currentAction.id === action.id ? { ...currentAction, checked } : currentAction));

                return {
                    ...item,
                    actions: nextActions,
                    checked: nextActions.some((a) => a.checked)
                };
            })
        );
    }

    areAllActionsChecked(module: ModulePermissionView): boolean {
        return module.actions.length > 0 && module.actions.every((action) => action.checked);
    }

    countSelectedActions(module: ModulePermissionView): number {
        return module.actions.filter((action) => action.checked).length;
    }

    getPayload(): { moduloId: number; accionId: number[] }[] {
        return this.allModules()
            .filter((module) => module.type === EnumModuleType.MODULO)
            .map((module) => ({
                moduloId: module.id,
                accionId: module.actions.filter((action) => action.checked && !!action.id).map((action) => action.id as number)
            }))
            .filter((item) => item.accionId.length > 0);
    }

    save(): void {
        const roleId = this.selectedRoleId();
        if (!roleId) return;

        const payload = this.getPayload();
        this.saving.set(true);

        this._roleService
            .assignPermissions(roleId, payload)
            .pipe(switchMap(() => this._authStore.refreshProfile()))
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Permisos actualizados',
                        detail: 'Los permisos del rol se actualizaron correctamente.'
                    });
                    this.saving.set(false);
                },
                error: (error) => {
                    console.error('Error al guardar permisos', error);
                    this.saving.set(false);
                }
            });
    }

    onCancel(): void {
        this.goBack();
    }

    protected goBack(): void {
        this._router.navigate(['./'], { relativeTo: this._route.parent });
    }
}
