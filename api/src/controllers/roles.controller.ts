import { Request, Response } from 'express';
import { Rol } from '../models/rols';

export class RolesController{
    static async createRole(req: Request, res: Response){
        await Rol.create({
            nombre: req.body.nombre
        }).then(role => {
            res.status(201).json(role);
        });
    }
}