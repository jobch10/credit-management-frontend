import { Component, computed, effect, inject } from '@angular/core';
import { LayoutService } from '../../service/layout.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../component/topbar/topbar.component';
import { SidebarComponent } from '../../component/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../component/footer/footer.component';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    imports: [CommonModule, TopbarComponent, SidebarComponent, RouterModule, FooterComponent]
})
export class MainLayoutComponent {
    layoutService = inject(LayoutService);

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });
}
