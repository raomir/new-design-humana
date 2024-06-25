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
                        label: 'Controles en el individuo',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/controls-on-the-individual'],
                    },
                    {
                        label: 'Mecanismos',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/mechanisms'],
                    },
                    {
                        label: 'Efectos posibles',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/possible-effects'],
                    },
                    {
                        label: 'Monitoreo enfermedad',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/disease-monitoring'],
                    },
                    {
                        label: 'Niveles de deficiencia',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/deficiency-levels'],
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
                        label: 'Parte afectada',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/affected-part'],
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
                    {
                        label: 'Agentes De Lesión',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/agent-injury'],
                    },
                    {
                        label: 'Niveles De Exposición',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/levels-exposure']
                    },  
                    { 
                        label: 'Peores Consecuencias',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/worst-consequences'],
                    },
                    { 
                        label: 'Niveles De Consecuencia',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/consequence-levels'],
                    },
                    { 
                        label: 'Jornada De Trabajo Habitual',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/regular-work-day'],
                    },
                    { 
                        label: 'Jornada de accidente',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/accident-workday'],
                    },
                    { 
                        label: 'Niveles De Gravedad',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/gravity-levels'],
                    },
                    { 
                        label: 'Niveles De Riesgo',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/risk-levels'],
                    },
                    { 
                        label: 'Ocupación CIE88',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/occupation-cie88'],
                    },
                    { 
                        label: 'Controles en el medio',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/controls-middle'],
                    },
                    { 
                        label: 'Eventos de investigación',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/investigation-events'],
                    },
                    { 
                        label: 'Controles en la fuente',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/source-controls'],
                    },
                    { 
                        label: 'Tipos de lesión',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/injury-types'],
                    },
                    { 
                        label: 'Dotaciones por cargo',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/endowments-per-charge'],
                    },
                    {
                        label: 'Niveles de Probabilidad',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/administration/probability-levels'],
                    },
                    {
                        label: 'Actividad',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/main/administration/activity'],
                    },
                    {
                        label: 'Procesos y Subprocesos',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/main/administration/processes-subprocesses'],

                    },
                    {
                        label: 'Tipos De Eventos',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/main/administration/type-events'],
                    },
                    {
                        label: 'Tipos De Actividad Comités',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/main/administration/type-committee-activity'],
                    },
                    {
                        label: 'Variable Indicador Medición',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/main/administration/variable-indicator-measurement'],
                    },
                    {
                        label: 'Tipos Indicadores Medición',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/main/administration/measurement-indicator-types'],
                    },
                    {
                        label: 'Rol Comités',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/main/administration/committee-roles'],
                    },
                    {
                        label: 'Comités',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/main/administration/committee'],
                    }
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
