import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';


export class ColumnConfig {
    constructor(private helperService: HelpersServiceImp) {}

    getColumns() {
        return [
          {
            title: 'Codigo',
            data: 'code',
            sort: 'code',
            width: '10%'
          },
          {
            title: 'Nombre',
            data: 'name',
            sort: 'name',
            width: '30%'
          },
          {
            title: 'Tipo',
            data: 'dangersList',
            sort: 'dangersList.name',
            width: '10%',
            render: (data: any) => data.name
          },
          {
            title: 'Descripción',
            data: 'description',
            sort: 'description',
            width: '35%',
          },
          {
            title: 'Activo',
            data: 'active',
            sort: 'active',
            classStatus: 'text-center',
            classTitle: 'text-center',
            render: (data: Number) => this.helperService.getColumnActive(data)
          },
          { title: 'Acciones', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar'] }
        ];
      }
}