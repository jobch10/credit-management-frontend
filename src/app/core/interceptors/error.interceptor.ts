import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { EnumExcepcionType } from '../enums/excepcion-type.enum';

function mapSeverity(type?: string): 'success' | 'info' | 'warn' | 'error' {
  switch (type) {
    case EnumExcepcionType.INFO:
      return 'info';
    case EnumExcepcionType.WARNING:
      return 'warn';
    case EnumExcepcionType.ERROR:
    default:
      return 'error';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let title = 'Error';
      let message = 'Ocurrió un error inesperado';
      let type: string | undefined = EnumExcepcionType.ERROR;

      if (error.error) {
        title = error.error.title ?? title;
        message = error.error.message ?? message;
        type = error.error.type ?? type;
      }

      messageService.add({
        severity: mapSeverity(type),
        summary: title,
        detail: message,
        life: 4000
      });

      return throwError(() => error);
    })
  );
};