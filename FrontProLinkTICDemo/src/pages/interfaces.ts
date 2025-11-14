export interface FormBase {
  user?: string;
  password?: string;
}

export class FormLogin implements FormBase {
  user?: string;
  password?: string;

  constructor(def?: FormBase){
    this.user = def?.user || '';
    this.password = def?.password || '';
  }
}
