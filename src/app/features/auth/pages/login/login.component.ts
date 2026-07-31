import { AuthStore } from '@/app/core/store/auth.store';
import { ButtonComponent } from '@/app/shared/components/button/button.component';
import { InputPasswordComponent } from '@/app/shared/components/input-password/input-password.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { take } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [ButtonModule, ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, InputTextComponent, InputPasswordComponent, ButtonComponent]
})
export class LoginComponent implements OnInit {
    formLogin!: FormGroup;
    isLoading = computed(() => this._store.isLoading());
    error = computed(() => this._store.error());

    private readonly _fb = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _store = inject(AuthStore);

    ngOnInit() {
        this._initForm();
    }

    private _initForm(): void {
        this.formLogin = this._fb.group({
            email: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
            password: [null, [Validators.required]],
            rememberme: [true]
        });
    }

    login(): void {
        if (this.formLogin.invalid) {
            this.formLogin.markAllAsTouched();
            return;
        }
        const { email, password } = this.formLogin.getRawValue();

        const payload = {
            email: String(email).trim(),
            password: String(password)
        };

        this._store
            .login(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this._router.navigateByUrl('/');
                }
            });
    }
}
