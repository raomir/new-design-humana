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
                            permissions: {
                                name: 'talentohumano.tipo_evaluacion_ocupacional',
                                only: 'talentohumano.tipo_evaluacion_ocupacional.index'
                            }
                        }
                    },
                ],
            },
        ],
    },
    {
        path: 'error',
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
