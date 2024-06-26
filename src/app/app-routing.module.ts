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
                            endpointExport: 'reportesSggt/reporteParametros1/Clase peligro/1',
                            module: 'url2',
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
                            endpointExport: 'reportesSggt/reporteParametros1/tipodeevaluacionocupacional/46',
                            module: 'url2',
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
                            endpoint: 'v2/listElementsst',
                            typeList: 45,
                            endpointExport: 'reportesSggt/reporteParametros1/monitoreoEnfermedad/45',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.monitoreo_enfermedad',
                                only: 'talentohumano.monitoreo_enfermedad.index'
                            }
                        }
                    },
                    {
                        path: 'controls-on-the-individual',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Controles en el individuo',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'controlindividuo/reporteControlindividuo',
                            module: 'url2',
                            typeList: 3, 
                            permissions: {
                                name: 'talentohumano.controles_individuo',
                                only: 'talentohumano.controles_individuo.index'
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
                            endpoint: 'v2/listElementsst',
                            typeList: 5,
                            endpointExport: 'reportesSggt/reporteParametros1/efectosPosibles/5',
                            module: 'url2',
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
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Objetos de inspección',
                            endpoint: 'objectoInpeccion',
                            endpointExport: 'reportesSggt/resportesObjectosInspeccion/objectosInspeccion/67',
                            module: 'url2',
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
                            endpoint: 'v2/listElementsst',
                            typeList: 8,
                            endpointExport: 'reportesSggt/reporteParametros1/Partes Afectadas/8',
                            module: 'url2',
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
                            endpoint: 'v2/listElementsst',
                            typeList: 11,
                            endpointExport: 'reportesSggt/reporteParametros1/Mecanismos/11',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.mecanismos',
                                only: 'talentohumano.mecanismos.index'
                            }
                        }
                    },
                    {
                        path: 'deficiency-levels',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles de deficiencia',
                            endpoint: 'niveldeficiencia',
                            endpointExport: 'reportesSggt/reporteNiveles/nivelesDeficiencia/34',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.niveles_deficiencia',
                                only: 'talentohumano.niveles_deficiencia.index'
                            }
                        }
                    },
                    {
                        path: 'agent-injury',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/agent-injury/agent-injury-index/agent-injury-index.component'
                            ).then((m) => m.AgentInjuryIndexComponent),
                    },
                    {
                        path: 'worst-consequences',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Peores Consecuencias',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/peoresConsecuencias/32',
                            module: 'url2',
                            typeList: 32,
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
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteNiveles/nivelesExposicicion/36',
                            module: 'url2',
                            nameComponent: "nivelexposicion",
                            typeList: 36, 
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
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteNiveles/nivelesConsecuencia/29',
                            typeList: 29,
                            nameComponent: "nivelconsecuencia",
                            module: 'url2',
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
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Jornadadetrabajohabitual/6',
                            typeList: 6, 
                            module: 'url2',
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
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/nivelesGravedad/9',
                            module: 'url2',
                            typeList: 9,
                            permissions: {
                                name: 'talentohumano.nivel_gravedad',
                                only: 'talentohumano.nivel_gravedad.index'
                            }
                        }
                    },
                    {
                        path: 'risk-levels',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles De Riesgo',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'nivelriesgo/reporteNivelRiesgo/nivelesRiesgo/50',
                            module: 'url2',
                            typeList: 50,
                            permissions: {
                                name: 'talentohumano.niveles_riesgo',
                                only: 'talentohumano.niveles_riesgo.index'
                            }
                        }
                    },
                    {
                        path: 'accident-workday',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Jornada de accidente',
                            endpoint: 'v2/listElementsst',
                            typeList: 7,
                            endpointExport: 'reportesSggt/reporteParametros1/jornadasAccidentes/7',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.jornada_accidente',
                                only: 'talentohumano.jornada_accidente.index'
                            }
                        }
                    },
                    {
                        path: 'occupation-cie88',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Occupation CIE88',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Ocupacion Cie88/33',
                            module: 'url2',
                            typeList: 33,
                            permissions: {
                                name: 'talentohumano.ocupacion_cie88',
                                only: 'talentohumano.ocupacion_cie88.index'
                            }
                        }
                    },
                    {
                        path: 'controls-middle',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Controles en el medio',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Controles en el medio/4',
                            module: 'url2',
                            typeList: 4,
                            permissions: {
                                name: 'talentohumano.controles_medio',
                                only: 'talentohumano.controles_medio.index'
                            }
                        }
                    },
                    {
                        path: 'investigation-events',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Eventos de investigación',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Eventos de Investigacion/16',
                            module: 'url2',
                            typeList: 16,
                            permissions: {
                                name: 'talentohumano.eventos_investigacion',
                                only: 'talentohumano.eventos_investigacion.index'
                            }
                        }
                    },
                    {
                        path: 'source-controls',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Controles en la fuente',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Controles en la Fuente/2',
                            module: 'url2',
                            typeList: 2,
                            permissions: {
                                name: 'talentohumano.controles_fuente',
                                only: 'talentohumano.controles_fuente.index'
                            }
                        }
                    },
                    {
                        path: 'injury-types',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Tipos de lesión',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Tipos de lesión/10',
                            module: 'url2',
                            typeList: 10,
                            permissions: {
                                name: 'talentohumano.tipos_lesion',
                                only: 'talentohumano.tipos_lesion.index'
                            }
                        }
                    },
                    {
                        path: 'endowments-per-charge',
                        children: [
                            {
                                path: '',
                                loadComponent: () =>
                                    import(
                                        './ssgt/parameter/infraestructure/adapter/primary/feature/endowments-per-charge/datatable/endowments-per-charge.component'
                                    ).then((m) => m.EndowmentsPerChargeComponent),
                                data: {
                                    permissions: {
                                        only: 'talentohumano.dotacion_cargo.index'
                                    }
                                },
                            },
                            {
                                path: 'edit/:id',
                                loadComponent: () =>
                                    import(
                                        './ssgt/parameter/infraestructure/adapter/primary/feature/endowments-per-charge/edit/endowments-per-charge-edit.component'
                                    ).then((m) => m.EndowmentsPerChargeEditComponent),
                                data: {
                                    permissions: {
                                        name: 'talentohumano.dotacion_cargo'
                                    }
                                },
                            },
                        ]

                    },
                    {
                        path: 'probability-levels',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Niveles de Probabilidad',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Niveles de Probabilidad/30',
                            module: 'url2',
                            typeList: '30',
                            permissions: {
                                name: 'talentohumano.niveles_probabilidad',
                                only: 'talentohumano.niveles_probabilidad.index'
                            }
                        }
                    },
                    {
                        path: 'activity',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/activity/activity-index/activity-index.component'
                            ).then((m) => m.ActivityIndexComponent),
                        data: {
                            title: 'Actividad',
                            endpoint: 'activity',
                            endpointExport: 'actividad/reporte',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.actividad',
                                only: 'talentohumano.actividad.index'
                            }
                        }
                    },
                    {
                        path: 'type-events',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/type-events/type-events-index/type-events-index.component'
                            ).then((m) => m.TypeEventsIndexComponent),
                        data: {
                            title: 'Tipos De Eventos',
                            endpoint: 'eventosSSST',
                            endpointExport: 'eventosSSST/reporte',
                            module: 'url2',
                            permissions: {
                                name: 'talentohumano.tipos_eventos',
                                only: 'talentohumano.tipos_eventos.index'
                            }
                        }
                    },
                    {
                        path: 'processes-subprocesses',
                        loadComponent: () =>
                            import(
                                './ssgt/parameter/infraestructure/adapter/primary/feature/processes-subprocesses/processes-subprocesses-index/processes-subprocesses-index.component'
                            ).then((m) => m.ProcessesSubprocessesIndexComponent),
                    },
                    {
                        path: 'type-committee-activity',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Tipos De Actividad Comités',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/tipoActividadComites/53',
                            module: 'url2',
                            typeList: '53',
                            permissions: {
                                name: 'administration.tipos_actividad',
                                only: 'administration.tipos_actividad.index'
                            }
                        }
                    },
                    {
                        path: 'variable-indicator-measurement',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Variable Indicador Medición',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/Variable Indicador Medición/51',
                            module: 'url2',
                            typeList: 51,
                            permissions: {
                                name: 'administration.variable_indicador_medicion',
                                only: 'administration.variable_indicador_medicion.index'
                            }
                        }
                    },
                    {
                        path: 'measurement-indicator-types',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/tree/tree-list.component'
                            ).then((m) => m.TreeListComponent),
                        data: {
                            title: 'Tipos Indicadores Medición',
                            endpoint: 'v2/listElementsst/tree/55',
                            endpointExport: 'tipoindicadormedicion/impresion',
                            module: 'url2',
                            typeList: 55,
                            permissions: {
                                name: 'talentohumano.actividad',
                                only: 'talentohumano.actividad.index'
                            }
                        }
                    },
                    {
                        path: 'committee-roles',
                        loadComponent: () =>
                            import(
                                './shared/components/element-list/datatable/element-list.component'
                            ).then((m) => m.ElementListComponent),
                        data: {
                            title: 'Rol Comités',
                            endpoint: 'v2/listElementsst',
                            endpointExport: 'reportesSggt/reporteParametros1/rolComite/52',
                            module: 'url2',
                            typeList: 52,
                            permissions: {
                                name: 'administration.rol_comites',
                                only: 'administration.rol_comites.index'
                            }
                        }
                    },
                    {
                        path: 'committee',
                        children: [
                            {
                                path: '',
                                loadComponent: () =>
                                    import(
                                        './ssgt/parameter/infraestructure/adapter/primary/feature/commitee/datatable/commitee.component'
                                    ).then((m) => m.CommiteeComponent),
                                data: {
                                    permissions: {
                                        only: 'talentohumano.committee.index'
                                    }
                                },
                            },
                            {
                                path: 'new',
                                loadComponent: () =>
                                    import(
                                        './ssgt/parameter/infraestructure/adapter/primary/feature/commitee/edit/commitee-edit.component'
                                    ).then((m) => m.CommiteeEditComponent),
                                data: {
                                    permissions: {
                                        name: 'talentohumano.committee'
                                    }
                                },
                            },
                            {
                                path: 'edit/:id',
                                loadComponent: () =>
                                    import(
                                        './ssgt/parameter/infraestructure/adapter/primary/feature/commitee/edit/commitee-edit.component'
                                    ).then((m) => m.CommiteeEditComponent),
                                data: {
                                    permissions: {
                                        name: 'talentohumano.committee'
                                    }
                                },
                            }
                        ]

                    }
                ]
            },
            {
                path: 'management',
                children: [
                    {
                        path: 'first-aid',
                        loadComponent: () =>
                            import(
                                './ssgt/management/infraestructure/adapter/primary/feature/first-aid/first-aid-index/first-aid-index.component'
                            ).then((m) => m.FirstAidIndexComponent),
                    },
                    {
                        path: 'first-aid/new-first-aid',
                        loadComponent: () =>
                            import(
                                './ssgt/management/infraestructure/adapter/primary/feature/first-aid/first-aid-form/first-aid-form.component'
                            ).then((m) => m.FirstAidFormComponent),
                    },
                ]
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