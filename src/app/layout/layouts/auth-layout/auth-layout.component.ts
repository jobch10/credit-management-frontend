import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingconfiguratorComponent } from '../../component/floatingconfigurator/floatingconfigurator.component';

@Component({
    selector: 'auth-layout',
    templateUrl: './auth-layout.component.html',
    imports: [RouterOutlet, FloatingconfiguratorComponent]
})
export class AuthLayoutComponent {}
