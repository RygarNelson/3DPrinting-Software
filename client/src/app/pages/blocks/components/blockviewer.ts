import {booleanAttribute, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';

enum BlockView {
    PREVIEW,
    CODE
}

@Component({
    selector: 'block-viewer',
    standalone: true,
    imports: [CommonModule, TooltipModule],
    template: `
        <div class="block-section">
            <div class="block-header">
                <span class="block-title">
                    <span>{{ header }}</span>
                    <span class="badge-free" *ngIf="free">Free</span>
                    <span class="badge-new" *ngIf="new">New</span>
                </span>
                <div class="block-actions">
                    <a
                        tabindex="0"
                        [ngClass]="{
                            'block-action-active': blockView === BlockView.PREVIEW
                        }"
                        (click)="activateView($event, BlockView.PREVIEW)"
                        ><span>Preview</span></a
                    >
                    <a
                        [attr.tabindex]="'0'"
                        [ngClass]="{
                            'block-action-active': blockView === BlockView.CODE
                        }"
                        (click)="activateView($event, BlockView.CODE)"
                    >
                        <span>Code</span>
                    </a>
                    <a [attr.tabindex]="'0'" class="block-action-copy" (click)="copyCode($event)" pTooltip="Copied to clipboard" tooltipEvent="focus" tooltipPosition="bottom"><i class="pi pi-copy m-0"></i></a>
                </div>
            </div>
            <div class="block-content">
                <div [class]="containerClass" [ngStyle]="previewStyle" *ngIf="blockView === BlockView.PREVIEW">
                    <ng-content></ng-content>
                </div>
                <div *ngIf="blockView === BlockView.CODE">
                    <pre class="app-code"><code>{{code}}</code></pre>
                </div>
            </div>
        </div>
    `,
    styles: `
        .block-section {
            margin-bottom: 4rem;
        }

        .block-header {
            padding: 1rem 2rem;
            background-color: var(--surface-card);
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border: 1px solid var(--surface-border);
            display: flex;
            align-items: center;
            justify-content: space-between;

            .block-title {
                font-weight: 700;
                display: inline-flex;
                align-items: center;

                .badge-free {
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                    background-color: var(--p-orange-500);
                    color: white;
                    margin-left: 1rem;
                    font-weight: 700;
                    font-size: 0.875rem;
                }
            }

            .block-actions {
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
                margin-left: 1rem;

                a {
                    display: flex;
                    align-items: center;
                    margin-right: 0.75rem;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    border: 1px solid transparent;
                    transition: background-color 0.2s;
                    cursor: pointer;

                    &:last-child {
                        margin-right: 0;
                    }

                    &:not(.block-action-disabled):hover {
                        background-color: var(--surface-hover);
                    }

                    &.block-action-active {
                        border-color: var(--primary-color);
                        color: var(--primary-color);
                    }

                    &.block-action-copy {
                        i {
                            color: var(--primary-color);
                            font-size: 1.25rem;
                        }
                    }

                    &.block-action-disabled {
                        opacity: 0.6;
                        cursor: auto !important;
                    }

                    i {
                        margin-right: 0.5rem;
                    }
                }
            }
        }

        .block-content {
            padding: 0;
            border: 1px solid var(--surface-border);
            border-top: 0 none;
        }

        pre[class*='language-'] {
            margin: 0 !important;

            &:before,
            &:after {
                display: none !important;
            }

            code {
                border-left: 0 none !important;
                box-shadow: none !important;
                background: var(--surface-card) !important;
                margin: 0;
                color: var(--text-color);
                font-size: 14px;
                padding: 0 2rem !important;

                .token {
                    &.tag,
                    &.keyword {
                        color: #2196f3 !important;
                    }

                    &.attr-name,
                    &.attr-string {
                        color: #2196f3 !important;
                    }

                    &.attr-value {
                        color: #4caf50 !important;
                    }

                    &.punctuation {
                        color: var(--text-color);
                    }

                    &.operator,
                    &.string {
                        background: transparent;
                    }
                }
            }
        }

        @media screen and (max-width: 575px) {
            .block-header {
                flex-direction: column;
                align-items: start;

                .block-actions {
                    margin-top: 1rem;
                    margin-left: 0;
                }
            }
        }
    `
})
export class BlockViewer {
    @Input() header!: string;

    @Input() code!: string;

    @Input() containerClass!: string;

    @Input() previewStyle!: object;

    @Input({ transform: booleanAttribute }) free: boolean = true;

    @Input({ transform: booleanAttribute }) new: boolean = false;

    BlockView = BlockView;

    blockView: BlockView = BlockView.PREVIEW;

    activateView(event: Event, blockView: BlockView) {
        this.blockView = blockView;
        event.preventDefault();
    }

    async copyCode(event: Event) {
        await navigator.clipboard.writeText(this.code);
        event.preventDefault();
    }
}
