import { Router } from "express";
import { RolesController } from "../controllers/roles.controller";

const router = Router();

router.post('/create', RolesController.createRole);
// router.get('list', RolesController.listRoles);
// router.get('get/:id', RolesController.getRoleById);
// router.put('update/:id', RolesController.updateRole);

export default router;