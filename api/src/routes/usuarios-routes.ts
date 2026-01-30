import { Router } from "express";
import { UsuarioService } from "../services/usaurio-service";
import { verificarToken } from "../middlewares/auth";

const router = Router();
const service = new UsuarioService();

router.post('login', service.login);
router.post('register', service.register);
router.get('/', verificarToken, service.getAllUsuarios);
router.get('/:id', verificarToken, service.getUsuarioById);
router.put('/:id', verificarToken, service.updateUsuario);
router.delete('/:id', verificarToken, service.deleteUsuario);

export default router;