import { Component, Input } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'error-message',
    templateUrl: './error-message.component.html',
    imports: [MessageModule]
})
export class ErrorMessageComponent {
    @Input() tooltipMessage: boolean | undefined;
    @Input() validatorMessage: boolean | undefined;
    @Input() controls: any;
    @Input() label: any;
    @Input() isInvalid: boolean = false;
}
