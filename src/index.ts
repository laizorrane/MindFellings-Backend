import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
import {UsuarioService} from "./services/Usuario.service";
import {RegistroDiarioService} from "./services/RegistroDiario.service";

// Banco firestore
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// Relacionada ao cadastro, edição e exclusão de usuário

const usuarioExpress = express();

const usuarioService = new UsuarioService(db);

usuarioExpress.post("/usuario", (req, res) => usuarioService.cadastrarUsuario(req, res));

usuarioExpress.get("/usuario", (req, res) => usuarioService.logarUsuario(req, res));

usuarioExpress.put("/usuario", (req, res) => usuarioService.editarUsuario(req, res));

export const usuarioLaiz = functions.https.onRequest(usuarioExpress);

// A segunda relacionada ao fornecimento de dados emocionais

const registroDiarioExpress = express();

const registroDiarioService = new RegistroDiarioService(db);

registroDiarioExpress.post("/registroEmocoes", (req, res) => registroDiarioService.manterRegistro(req, res));

registroDiarioExpress.delete("/registroEmocoes", (req, res) => registroDiarioService.excluiRegistro(req, res));

registroDiarioExpress.get("/registroEmocoes", (req, res) => registroDiarioService.listaRegistros(req, res));

export const registroEmocionalLaiz = functions.https.onRequest(registroDiarioExpress);
