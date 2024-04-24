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
                        path: 'affected-part',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Parte afectada',
                            endpoint: 'parteafectada',
                            name: 'talentohumano.parte_afectada',
                        }
                    }
                ]
    },
    {
        loadComponent: () =>
            import(
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
