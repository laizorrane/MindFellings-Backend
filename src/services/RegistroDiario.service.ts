import {firestore} from "firebase-admin";
import {Request, Response} from "express";
import {HttpUtil} from "../util/HttpUtil";
import { RegistroDiario } from "../Model/RegistroDiario";

export class RegistroDiarioService {
    private db: firestore.Firestore;

    constructor(db:firestore.Firestore) {
      this.db = db;
    }

    /**
     * criar/editar um registro
     */

    public manterRegistro(request: Request, response: Response) {
      if (request.body === undefined) {
        request.body = {};
      }
      const registroDiario = RegistroDiario.toRegistroDiario(request.body);
      if (registroDiario.isValida() ) {
        if (registroDiario.id === undefined || registroDiario.id === null || registroDiario.id === "null") {
          registroDiario.id = this.db.collection("icone").doc().id;
          registroDiario.dataDeRegistro = new Date();
        } else {
          registroDiario.dataDeRegistro = new Date (registroDiario.dataDeRegistro?.toString());
        }
        this.db.doc(`registrosMindLaiz/${registroDiario.id}`).set(registroDiario.toJson(), {merge: true})
            .then(_resultadoSnap => {
              HttpUtil.sucesso(registroDiario.toJson(), response);
            }).catch(erro => {
              HttpUtil.falha("registro inválido." +erro, response);
            });
      } else {
        HttpUtil.falha("registro inválido.", response);
      }
    }

  

    /**
     * Excluir Registro - /registroDiario (DELETE)
     */
    public excluiRegistro(request: Request, response: Response) {
      if (request.query.id === undefined || request.query.id === "") {
        HttpUtil.falha("Registro inválido", response);
      } else {
        this.db.doc(`registrosMindLaiz/${request.query.id}`).delete().then((_) => {
          HttpUtil.sucesso("Registro excluído com sucesso", response);
        }).catch((erro) => {
          HttpUtil.falha("Ops, tive uma falha" +erro, response);
        });
      }
    }

    /**
     * Listagem de Registros  - /registrosDiarios (GET)
     */
    public listaRegistros (request: Request, response: Response) {
      this.db.collection("registrosMindLaiz").orderBy("dataDeRegistro", "asc").get().then((registroSnap) => {
        const listRegistro: RegistroDiario[] = [];
        registroSnap.docs.forEach((regSnap) => {
          listRegistro.push(RegistroDiario.toRegistroDiario(regSnap.data()));
        });
        HttpUtil.sucesso(listRegistro, response);
      }).catch((erro) => {
        HttpUtil.falha("Ops! Houve um erro inesperado" +erro, response);
      });
    }


}


