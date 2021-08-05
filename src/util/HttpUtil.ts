import {Response} from "express";

export class HttpUtil {
  static sucesso(resposta : any, response:Response): any {
    return response.send({
      "sucesso": resposta,
    });
  }

  static falha(resposta : any, response:Response): any {
    return response.status(500).send({
      "falha": resposta,
    });
  }
}
