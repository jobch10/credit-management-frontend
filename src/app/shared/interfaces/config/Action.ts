import { EnumTagSeverity } from '../../components/table-customizable/interfaces/table-customizable.interfaces';

export interface Action {
    id?: number | null;
    code?: string | null;
    icon?: string | null;
    color?: EnumTagSeverity | null;
    name?: string | null;
    state?: boolean | null;
}
