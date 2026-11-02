import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MessageUtilService {
  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  getMessageError(codigo: string, element: string = '', message?: string): void {
    let summary = element || 'Error';
    let detail = '';

    switch (codigo) {
      case 'A001':
        detail = `El campo ${element} es requerido`;
        summary = 'Error';
        break;
      case 'A002':
        detail = `El campo ${element} no cumple con el formato establecido`;
        summary = 'Error';
        break;
      case 'A003':
        detail = `La fecha ingresada no puede ser superior a la fecha del día actual`;
        summary = 'Error';
        break;
      case 'A004':
        detail = `La fecha del documento no puede ser menor a la fecha del ultimo documento ingresado`;
        summary = 'Error';
        break;
      case '000046':
        detail = message ?? '';
        summary = element || 'Error';
        break;
      case 'A005':
        detail = `No ha ingresado la serie`;
        summary = 'Error';
        break;
      case 'A999':
        detail = `${element}`;
        summary = 'Advertencia';
        break;
      case '500':
        detail = `Por favor comuníquese con el soporte del Sistema`;
        summary = 'Error';
        break;
      default:
        detail = element;
        summary = 'Error';
        break;
    }

    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 4000,
    });
  }

  getAlertWarning(mensaje: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: mensaje,
      life: 4000,
    });
  }

  getAlertSuccess(mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 3000,
    });
  }

  confirm(options: {
    message?: string;
    header?: string;
    icon?: string;
    accept: () => void;
    reject?: () => void;
  }): void {
    this.confirmationService.confirm({
      message: options.message || '¿Está seguro de que desea realizar esta acción?',
      header: options.header || 'Confirmación',
      icon: options.icon || 'pi pi-exclamation-triangle',
      accept: options.accept,
      reject: options.reject,
    });
  }
}