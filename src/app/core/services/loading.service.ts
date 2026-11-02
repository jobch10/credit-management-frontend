import { Injectable, computed, signal } from '@angular/core';
import { Observable, defer, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private readonly _count = signal(0);
    private readonly _message = signal('Cargando datos...');

    readonly visible = computed(() => this._count() > 0);
    readonly message = this._message.asReadonly();

    show(message = 'Cargando datos...'): void {
        this._message.set(message);
        this._count.update((c) => c + 1);
    }

    hide(): void {
        this._count.update((c) => Math.max(0, c - 1));
    }

    /** Envuelve un observable: muestra el loading al suscribirse y lo oculta al terminar (éxito o error). */
    track<T>(source$: Observable<T>, message?: string): Observable<T> {
        return defer(() => {
            this.show(message);
            return source$.pipe(finalize(() => this.hide()));
        });
    }
}
