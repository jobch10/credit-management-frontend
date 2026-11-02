import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
    selector: 'ui-button',
    imports: [ButtonModule],
    template: `<p-button
        #btn
        [size]="size"
        [label]="label"
        [icon]="icon"
        [iconPos]="iconPos"
        [severity]="severity"
        [outlined]="outlined"
        [rounded]="rounded"
        [text]="text"
        [raised]="raised"
        [loading]="loading"
        [disabled]="disabled"
        [styleClass]="styleClass"
        [type]="type"
        (onClick)="buttonClick.emit($event)"
    ></p-button>`
})
export class ButtonComponent {
    @ViewChild('btn', { read: ElementRef }) btnRef!: ElementRef<HTMLElement>;

    @Input() label?: string;
    @Input() size: 'small' | 'large' | undefined = undefined;
    @Input() icon?: string;
    @Input() iconPos: 'left' | 'right' = 'left';
    @Input() severity?: ButtonSeverity;
    @Input() outlined = false;
    @Input() rounded = false;
    @Input() text = false;
    @Input() raised = false;
    @Input() loading = false;
    @Input() disabled = false;
    @Input() styleClass?: string;
    @Input() type: 'button' | 'submit' = 'button';

    @Output() buttonClick = new EventEmitter<Event>();

    focus(): void {
        const el = this.btnRef?.nativeElement?.querySelector('button') as HTMLButtonElement | undefined;
        el?.focus();
    }
}
