import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () =>
            import(
                './auth/components/login/login.component'
            ).then((m) => m.LoginComponent),
    },
    {
        path: 'main',
        loadComponent: () =>
            import(
                './ssgt/parameter/infraestructure/adapter/primary/root/main/app.main.component'
            ).then((m) => m.AppMainComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import(
                        './ssgt/parameter/infraestructure/adapter/primary/feature/dashboard/dashboard.component'
                    ).then((m) => m.DashboardComponent),
            },
            {
                path: 'administration',
                children: [
                    {
                        path: 'company',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/company/company.component'
                            ).then((m) => m.CompanyComponent),
                    },
                    {
                        path: 'danger-class',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Clases peligro',
                            endpoint: 'clasepeligro',
                            permissions: {
                                name: 'talentohumano.clase_peligro',
                                only: 'talentohumano.clase_peligro.index'
                            }
                        }
                    },
                    {
                        path: 'accident-causes',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/accident-causes/accident-causes-index/accident-causes-index.component'
                            ).then((m) => m.AccidentCausesIndexComponent),
                    },
                    {
                        path: 'occupational-evaluation-type',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Tipos de evaluación ocupacional',
                            endpoint: 'tipodeevaluacionocupacional',
                            endpointexport: 'reportesSggt/reporteParametros1/tipodeevaluacionocupacional/46',
                            module: 'url2',
                            export: true,
                            titleexport: 'Tipo De Evaluación Ocupacional',
                            permissions: {
                                name: 'talentohumano.tipo_evaluacion_ocupacional',
                                only: 'talentohumano.tipo_evaluacion_ocupacional.index'
                            }
                        }
                    },
                    {
                        path: 'disease-monitoring',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Monitoreo enfermedad',
                            endpoint: 'monitoreoenfermedad',
                            permissions: {
                                name: 'talentohumano.monitoreo_enfermedad',
                                only: 'talentohumano.monitoreo_enfermedad.index'
                            }
                        }
                    },
                    {
                        path: 'possible-effects',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Efectos posibles',
                            endpoint: 'efectoposible',
                            permissions: {
                                name: 'talentohumano.efecto_posible',
                                only: 'talentohumano.efecto_posible.index'
                            }
                        }
                    },
                    {
                        path: 'inspection-objects',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/components/inspection-objects/datatable/inspection-objects.component'
                            ).then((m) => m.InspectionObjectsComponent),
                        data: {
                            permissions: {
                                name: 'talentohumano.tipo_evaluacion_ocupacional',
                                only: 'talentohumano.tipo_evaluacion_ocupacional.index'
                            }
                        }
                    },
                    {
                        path: 'affected-part',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Parte afectada',
                            endpoint: 'parteafectada',
                            permissions: {
                                name: 'talentohumano.parte_afectada',
                                only: 'talentohumano.parte_afectada.index'
                            }
                        }
                    },
                    {
                        path: 'mechanisms',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Mecanismos',
                            endpoint: 'mecanismo',
                            permissions: {
                                name: 'talentohumano.mecanismos',
                                only: 'talentohumano.mecanismos.index'
                            }
                        }
                    },
                    {
                        path: 'injury-agent',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Agentes De Lesión',
                            endpoint: 'agentelesion',
                            addtypeinjuryAgent: true,
                            endpointexport: 'agentelesion/agenteLesion',
                            module: 'url2',
                            export: true,
                            titleexport: 'Agentes De Lesíon',
                            permissions: {
                                name: 'talentohumano.agentes_lesion',
                                only: 'talentohumano.agentes_lesion.index'
                            }
                        }
                    },
                    {
                        path: 'worst-consequences',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Peores Consecuencias',
                            endpoint: 'peorconsecuencia',
                            endpointexport: 'reportesSggt/reporteParametros1/peoresConsecuencias/32',
                            module: 'url2',
                            export: true,
                            titleexport: 'Peores Consecuencias',
                            permissions: {
                                name: 'talentohumano.peores_consecuencias',
                                only: 'talentohumano.peores_consecuencias.index'
                            }
                        }
                    },
                    {
                        path: 'levels-exposure',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles de exposición',
                            endpoint: 'nivelexposicion',
                            addworth: true,
                            endpointexport: 'reportesSggt/reporteNiveles/nivelesExposicicion/36',
                            module: 'url2',
                            export: true,
                            titleexport: 'Niveles de exposición',
                            permissions: {
                                name: 'talentohumano.niveles_exposicion',
                                only: 'talentohumano.niveles_exposicion.index'
                            }
                        }
                    },
                    {
                        path: 'consequence-levels',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles De Consecuencia',
                            endpoint: 'nivelconsecuencia',
                            addworth: true,
                            endpointexport: 'reportesSggt/reporteNiveles/nivelesConsecuencia/29',
                            module: 'url2',
                            export: true,
                            titleexport: 'Niveles De Consecuencia',
                            permissions: {
                                name: 'talentohumano.niveles_consecuencia',
                                only: 'talentohumano.niveles_consecuencia.index'
                            }
                        }
                    },
                    {
                        path: 'regular-work-day',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Jornada De Trabajo Habitual',
                            endpoint: 'jornadatrabajo',
                            endpointexport: 'reportesSggt/reporteParametros1/Jornadadetrabajohabitual/6',
                            module: 'url2',
                            export: true,
                            titleexport: 'Jornada De Trabajo Habitual',
                            permissions: {
                                name: 'talentohumano.jornada_trabajo_habitual',
                                only: 'talentohumano.jornada_trabajo_habitual.index'
                            }
                        }
                    },
                    {
                        path: 'gravity-levels',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles De Gravedad',
                            endpoint: 'nivelgravedad',
                            endpointexport: 'reportesSggt/reporteParametros1/nivelesGravedad/9',
                            module: 'url2',
                            export: true,
                            titleexport: 'Niveles De Gravedad',
                            permissions: {
                                name: 'talentohumano.nivel_gravedad',
                                only: 'talentohumano.nivel_gravedad.index'
                            }
                        }
                    }
                ],
            }
        ]
    },
    {
        path: '**',
        loadComponent: () =>
            import(
                './ssgt/parameter/infraestructure/adapter/primary/root/error/app.error.component'
            ).then((m) => m.AppErrorComponent),
    },
    {
        path: 'access',
        loadComponent: () =>
            import(
                './ssgt/parameter/infraestructure/adapter/primary/root/accessdenied/app.accessdenied.component'
            ).then((m) => m.AppAccessdeniedComponent),
    },
    {
        path: 'notfound',
        loadComponent: () =>
            import(
                './ssgt/parameter/infraestructure/adapter/primary/root/notfound/app.notfound.component'
            ).then((m) => m.AppNotfoundComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import(
                './ssgt/parameter/infraestructure/adapter/primary/root/login/app.login.component'
            ).then((m) => m.AppLoginComponent),
    },
    { path: '**', redirectTo: '/notfound' },
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }