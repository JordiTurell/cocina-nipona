import { UUID } from "node:crypto";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: 'roles',
    timestamps: true
})

export class Rol extends Model {
    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        unique: true,
    })
    id!: UUID

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    nombre!: string;
}