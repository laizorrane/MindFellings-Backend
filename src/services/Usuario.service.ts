import {firestore} from "firebase-admin";
import {Request, Response} from "express";
import {ManterUsuario} from "../Model/ManterUsuario";
import {HttpUtil} from "../util/HttpUtil";


export class UsuarioService {
    private db: firestore.Firestore;

    constructor(db: firestore.Firestore) {
      this.db = db;
    }

    /**
     * O serviço cadastra o usuário, validando se ele existe ou não.
     */
    public cadastrarUsuario(request:Request, response:Response) {
      const usuario:ManterUsuario = ManterUsuario.toManterUsuario(request.body);
      if (usuario.isUsuarioValido()) {
        this.db.collection("usuariosMindLaiz").where("email", "==", usuario.email).get()
            .then((usuariosSnaps) => {
              if (usuariosSnaps.size === 0) {
                const id = this.db.collection("icone").doc().id;
                usuario.id = id;
                return this.db.doc(`usuariosMindLaiz/${id}`).create(usuario.toJson());
              } else {
                HttpUtil.falha("O usuário já existe, não é possível cadastrar", response);
                return null;
              }
            }).then((responseCriacaoUsuario) => {
              if (responseCriacaoUsuario != null) {
                HttpUtil.sucesso(usuario, response);
              }
            }).catch((erro) => {
              HttpUtil.falha("Opa! Tive uma falha" + erro, response);
            });
      } else {
        HttpUtil.falha("Usuário inválido", response);
      }
    }

    /**
     * logarUsuario
     */
    public logarUsuario(request:Request, response:Response) {
      const email = request.query.email;
      const senha = request.query.senha;

      if (email === null || email === "" || senha === null || senha === "") {
        HttpUtil.falha("Usuário e senha incorretos.", response);
      } else {
        this.db.collection("usuariosMindLaiz").where("email", "==", email).where("senha", "==", senha)
            .get().then((usuarioConsultaSnap) => {
              if (usuarioConsultaSnap.empty) {
                HttpUtil.falha("Usuário e senha incorretos.", response);
              } else {
                const usuario = ManterUsuario.toManterUsuario(usuarioConsultaSnap.docs[0].data());
                HttpUtil.sucesso(usuario.toJson(), response);
              }
            }).catch((erro) => {
              HttpUtil.falha("Ops! Tive uma falha" + erro, response);
            });
      }
    }

    /**
     * editarUsuario
     */
    public editarUsuario(request: Request, response: Response) {
      const usuarioEditar = ManterUsuario.toManterUsuario(request.body);
      if (usuarioEditar.isUsuarioValido() && usuarioEditar.id !== undefined && usuarioEditar.id !== "") {
        this.db.doc(`usuariosMindLaiz/${usuarioEditar.id}`).set(usuarioEditar.toJson())
            .then((_resultadoSnap) => {
              HttpUtil.sucesso(usuarioEditar.toJson(), response);
            }).catch((erro) => {
              HttpUtil.falha("Houve um erro ao editar" +erro, response);
            });
      } else {
        HttpUtil.falha("O usuário é inválido", response);
      }
    }
}
