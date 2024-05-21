export class List {
  constructor(
    public data: response
  ) {}
}

export class response {
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public active: Number,
    public favorite: Number,
    public id?: Number,
    public listaPeligro?: Array<any>,
    public metadatos?: {
      valor: Number
    }
  ) {}
}

export class RequestList {
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public active: Number,
    public favorite: Number,
    public sst: number,
    public typeListId: number
  ){}
}