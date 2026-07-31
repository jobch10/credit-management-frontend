import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../service/layout.service';
import { ConfiguratorComponent } from '../configurator/configurator.component';

@Component({
    selector: 'app-floating-configurator',
    templateUrl: './floatingconfigurator.component.html',
    imports: [CommonModule, ButtonModule, StyleClassModule, ConfiguratorComponent]
})
export class FloatingconfiguratorComponent {
    LayoutService = inject(LayoutService);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
