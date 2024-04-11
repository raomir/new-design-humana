import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import(
                './ssgt/infraestructure/adapter/primary/root/main/app.main.component'
            ).then((m) => m.AppMainComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import(
                        './ssgt/infraestructure/adapter/primary/feature/dashboard/dashboard.component'
                    ).then((m) => m.DashboardComponent),
            },
            {
                path: 'administration',
                children: [
                    {
                        path: 'company',
                        loadComponent: () =>
                            import(
                                './ssgt/infraestructure/adapter/primary/feature/company/company.component'
                            ).then((m) => m.CompanyComponent),
                    },
                ],
            },
        ],
    },
    {
        path: 'error',
        loadComponent: () =>
            import(
                './ssgt/infraestructure/adapter/primary/root/error/app.error.component'
            ).then((m) => m.AppErrorComponent),
    },
    {
        path: 'access',
        loadComponent: () =>
            import(
                './ssgt/infraestructure/adapter/primary/root/accessdenied/app.accessdenied.component'
            ).then((m) => m.AppAccessdeniedComponent),
    },
    {
        path: 'notfound',
        loadComponent: () =>
            import(
                './ssgt/infraestructure/adapter/primary/root/notfound/app.notfound.component'
            ).then((m) => m.AppNotfoundComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import(
                './ssgt/infraestructure/adapter/primary/root/login/app.login.component'
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
export class AppRoutingModule {}
