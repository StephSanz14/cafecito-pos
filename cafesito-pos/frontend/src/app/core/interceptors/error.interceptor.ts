import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export type ApiError = {
  message: string;
  status?: number;
  raw?: unknown;
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      // Log completo para debug
      console.error('[HTTP ERROR]', req.method, req.url, err);

      // Normalizamos el mensaje para TODA la app
      if (err instanceof HttpErrorResponse) {
        const backend = err.error as any;

        const message =
          backend?.message || // si tu backend manda { message: '...' }
          backend?.error ||   // si manda { error: '...' }
          (typeof backend === 'string' ? backend : null) ||
          `Error HTTP ${err.status}`;

        const apiError: ApiError = {
          message,
          status: err.status,
          raw: backend ?? err,
        };

        return throwError(() => apiError);
      }

      const apiError: ApiError = {
        message: 'Ocurrió un error inesperado',
        raw: err,
      };

      return throwError(() => apiError);
    })
  );
};