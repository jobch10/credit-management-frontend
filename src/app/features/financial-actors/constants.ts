import { EnumEmploymentType, EnumHousingType, EnumInfocorpStatus, EnumMaritalStatus, EnumRiskTolerance, EnumSubjectStatus } from '@/app/shared/enums';

export const STATUS_OPTIONS = [
    { label: 'Activo', value: EnumSubjectStatus.ACTIVO },
    { label: 'Inactivo', value: EnumSubjectStatus.INACTIVO },
    { label: 'Bloqueado', value: EnumSubjectStatus.BLOQUEADO }
];

export const MARITAL_STATUS_OPTIONS = [
    { label: 'Soltero', value: EnumMaritalStatus.SOLTERO },
    { label: 'Casado', value: EnumMaritalStatus.CASADO },
    { label: 'Divorciado', value: EnumMaritalStatus.DIVORCIADO },
    { label: 'Viudo', value: EnumMaritalStatus.VIUDO },
    { label: 'Conviviente', value: EnumMaritalStatus.CONVIVIENTE }
];

export const HOUSING_TYPE_OPTIONS = [
    { label: 'Propia', value: EnumHousingType.PROPIA },
    { label: 'Alquilada', value: EnumHousingType.ALQUILADA },
    { label: 'Familiar', value: EnumHousingType.FAMILIAR }
];

export const EMPLOYMENT_TYPE_OPTIONS = [
    { label: 'Dependiente', value: EnumEmploymentType.DEPENDIENTE },
    { label: 'Independiente', value: EnumEmploymentType.INDEPENDIENTE },
    { label: 'Jubilado', value: EnumEmploymentType.JUBILADO },
    { label: 'Desempleado', value: EnumEmploymentType.DESEMPLEADO }
];

export const INFOCORP_STATUS_OPTIONS = [
    { label: 'Normal', value: EnumInfocorpStatus.NORMAL },
    { label: 'CPP', value: EnumInfocorpStatus.CPP },
    { label: 'Dudoso', value: EnumInfocorpStatus.DUDOSO },
    { label: 'Pérdida', value: EnumInfocorpStatus.PERDIDA }
];

export const YES_NO_OPTIONS = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
];

export const RISK_TOLERANCE_OPTIONS = [
    { label: 'Conservador', value: EnumRiskTolerance.CONSERVADOR },
    { label: 'Moderado', value: EnumRiskTolerance.MODERADO },
    { label: 'Agresivo', value: EnumRiskTolerance.AGRESIVO }
];
