import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { AppComponent } from 'src/app/app.component'
import { AppInlineMenuComponent } from '../inlinemenu/app.inlinemenu.component'
import { AppMainComponent } from '../main/app.main.component'
import { AppMenuitemComponent } from '../menuitem/app.menuitem.component'

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [AppInlineMenuComponent, CommonModule, AppMenuitemComponent],
})
export class AppMenuComponent implements OnInit {
    public model: any[] = []

    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent
    ) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                routerLink: [''],
            },
            {
                label: 'Parámetros',
                icon: 'pi pi-fw pi-star',
                items: [
                    {
                        label: 'Instituciones',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/company'],
                    },
                    {
                        label: 'Clases Peligro',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/danger-class'],
                    },
                    {
                        label: 'Tipos de evaluación ocupaciona',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/occupational-evaluation-type'],
                    },
                    {
                        label: 'Objetos de inspección',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/inspection-objects'],
                    },
                    {
                        label: 'Sedes',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/uikit/input'],
                    },
                    {
                        label: 'Causas Accidentes',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/accident-causes'],
                    },
                ],
            },
            {
                label: 'Gestión',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Parámetros',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Calendario',
                                icon: 'pi pi-fw pi-calendar-plus',
                                routerLink: ['/pages/calendar'],
                            },
                            {
                                label: 'Recursos Físicos',
                                icon: 'pi pi-fw pi-calendar-plus',
                                routerLink: ['/pages/calendar'],
                            },
                        ],
                    },
                    {
                        label: 'Gestión',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline'],
                    },
                    {
                        label: 'Procesos',
                        icon: 'pi pi-fw pi-globe',
                        url: 'assets/pages/landing.html',
                        target: '_blank',
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/login'],
                    },
                ],
            },
            {
                label: 'Procesos',
                icon: 'pi pi-fw pi-globe',
            },
            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-sign-in',
            },
        ]
    }
}
