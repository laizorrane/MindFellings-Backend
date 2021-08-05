import { ManterUsuario } from "./ManterUsuario";

export class RegistroDiario {
  id?: string;
  emocao?: String;
  conteudo?: string;
  dataDeRegistro?: any;
  criador?: ManterUsuario;


  constructor(
    id?: string,
    emocao?: string,
    conteudo?: string,
    dataDeRegistro?: any,
    criador?: ManterUsuario,

  ) {
    this.id = id;
    this.emocao = emocao;
    this.conteudo = conteudo;
    this.dataDeRegistro = dataDeRegistro;
    this.criador = criador;
  }

  public isValida(): boolean {
    return this.conteudo !== undefined && this.criador !== undefined && this.isEmocaoValida();
  }

  private isEmocaoValida(): boolean {
    switch (this.emocao) {
      case "RADIANTE":
        return true;
      case "FELIZ":
        return true;
      case "INDIFERENTE":
        return true;
      case "RAIVA":
        return true;
      case "TRISTE":
        return true;
      default:
        return false;
    }

  }

  static toRegistroDiario(json: any): RegistroDiario {
    return new RegistroDiario(json.id, json.emocao, json.conteudo, json.dataDeRegistro, ManterUsuario.toManterUsuario(json.criador));
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}