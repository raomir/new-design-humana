export class List {
    constructor(
      public codigo: string,
      public nombre: string,
      public descripcion: string,
      public activo: Number,
      public favorito: Number,
      public id?: Number,
      public listaPeligro?: Array<any>
    ) {}
   }