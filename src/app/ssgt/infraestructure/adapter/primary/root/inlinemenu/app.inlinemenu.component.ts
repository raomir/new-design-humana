import { animate, state, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { AppMainComponent } from '../main/app.main.component'

@Component({
    selector: 'app-inlinemenu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('inline', [
            state(
                'hidden',
                style({
                    height: '0px',
                    overflow: 'hidden',
                })
            ),
            state(
                'visible',
                style({
                    height: '*',
                })
            ),
            state(
                'hiddenAnimated',
                style({
                    height: '0px',
                    overflow: 'hidden',
                })
            ),
            state(
                'visibleAnimated',
                style({
                    height: '*',
                })
            ),
            transition(
                'visibleAnimated => hiddenAnimated',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
            ),
            transition(
                'hiddenAnimated => visibleAnimated',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
            ),
        ]),
    ],
    standalone: true,
    imports: [CommonModule],
})
export class AppInlineMenuComponent {
    constructor(public appMain: AppMainComponent) {}
}
