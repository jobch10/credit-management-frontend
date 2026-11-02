import { EnumGuaranteeType, EnumInstallmentStatus, EnumLoanStatus, EnumPaymentFrequency, EnumPaymentMethod } from '@/app/shared/enums';

export const LOAN_STATUS_OPTIONS = [
    { label: 'Pendiente', value: EnumLoanStatus.PENDIENTE },
    { label: 'Activo', value: EnumLoanStatus.ACTIVO },
    { label: 'Pagado', value: EnumLoanStatus.PAGADO },
    { label: 'Vencido', value: EnumLoanStatus.VENCIDO },
    { label: 'Cancelado', value: EnumLoanStatus.CANCELADO }
];

export const PAYMENT_FREQUENCY_OPTIONS = [
    { label: 'Mensual', value: EnumPaymentFrequency.MENSUAL },
    { label: 'Quincenal', value: EnumPaymentFrequency.QUINCENAL },
    { label: 'Semanal', value: EnumPaymentFrequency.SEMANAL }
];

export const GUARANTEE_TYPE_OPTIONS = [
    { label: 'Personal (aval)', value: EnumGuaranteeType.PERSONAL },
    { label: 'Hipotecaria', value: EnumGuaranteeType.HIPOTECARIA },
    { label: 'Mobiliaria', value: EnumGuaranteeType.MOBILIARIA },
    { label: 'Sin garantía', value: EnumGuaranteeType.SIN_GARANTIA }
];

export const INSTALLMENT_STATUS_OPTIONS = [
    { label: 'Pendiente', value: EnumInstallmentStatus.PENDIENTE },
    { label: 'Pagada', value: EnumInstallmentStatus.PAGADA },
    { label: 'Vencida', value: EnumInstallmentStatus.VENCIDA },
    { label: 'Parcial', value: EnumInstallmentStatus.PARCIAL }
];

export const PAYMENT_METHOD_OPTIONS = [
    { label: 'Efectivo', value: EnumPaymentMethod.EFECTIVO },
    { label: 'Transferencia', value: EnumPaymentMethod.TRANSFERENCIA },
    { label: 'Yape', value: EnumPaymentMethod.YAPE },
    { label: 'Plin', value: EnumPaymentMethod.PLIN },
    { label: 'Depósito', value: EnumPaymentMethod.DEPOSITO }
];
