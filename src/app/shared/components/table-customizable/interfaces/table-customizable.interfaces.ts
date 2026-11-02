import { TemplateRef } from '@angular/core';

export enum EnumTagSeverity {
    SUCCESS = 'success',
    DANGER = 'danger',
    WARN = 'warn',
    INFO = 'info',
    SECONDARY = 'secondary',
    CONTRAST = 'contrast'
}

export interface TableTagData {
    value: string;
    severity: EnumTagSeverity;
}

export interface TableIconData {
    icon: string;
    severity: EnumTagSeverity;
}

export interface TableColumn<T> {
    field: keyof T | string;
    header: string;
    type?: 'text' | 'tag' | 'icon' | 'custom';
    sortable?: boolean;
    minWidth?: string;
    maxWidth?: string;
    width?: string;
    frozen?: boolean;
    tagConfig?: (row: T) => TableTagData;
    iconConfig?: (row: T) => TableIconData;
    severityMap?: Record<string, EnumTagSeverity>;
    cellTemplate?: TemplateRef<any>;
}

export interface TableRowButton<T> {
    key: string;
    icon: string;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;
    tooltip?: string;
    visible?: boolean | ((row: T) => boolean);
    disabled?: boolean | ((row: T) => boolean);
}

export interface TableHeaderButton {
    key?: string;
    label?: string;
    icon?: string;
    color?: string;
    disabled?: boolean;
    visible?: boolean;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
    outlined?: boolean;
    action?: () => void;
}
