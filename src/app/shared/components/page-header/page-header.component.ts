import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'page-header',
    templateUrl: './page-header.component.html',
    imports: [ButtonComponent]
})
export class PageHeaderComponent {
    title = input<string | undefined>('');
    subtitle = input<string | undefined>('');
    icon = input<string | undefined>('pi pi-shopping-cart');
    showClearFilter = input<boolean>(false);

    clearFilter = output<void>();

    onClearFilter() {
        this.clearFilter.emit();
    }
}
