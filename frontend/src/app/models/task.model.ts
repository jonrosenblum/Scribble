export class Task {
  constructor(
    public _id: string,
    public _listId: string,
    public title: string,
    public completed: boolean
  ) {}
}
