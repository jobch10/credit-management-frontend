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

export interface TableColumn<T> {
    field: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    frozen?: boolean; // fija la columna a la izquierda
    type?: 'text' | 'tag' | 'custom';
    tagConfig?: (row: T) => TableTagData;
    severityMap?: Record<string, EnumTagSeverity>;
    cellTemplate?: TemplateRef<any>;
}

export interface TableRowButton<T> {
    key: string;
    icon: string;
    color?: string;
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
