import { Request, Response } from "express";
import { createWorkerSchema, loginWorkerSchema, updateWorkerSchema } from "../schemas/workerSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as workerService from "../services/workerService";

//================================
// Main Worker Functions
//================================
export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const workers = await workerService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(workers));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const worker = await workerService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(worker));
});

export const getWorkerAllInfoById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const worker = await workerService.getWorkerAllInfoById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(worker));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkerSchema.parse(req.body);
    const newWorker = await workerService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newWorker));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateWorkerSchema.parse(req.body);
    const updatedWorker = await workerService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedWorker));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedWorker = await workerService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedWorker));
});

//================================
// Role Functions
//================================
export const getRoles = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const roles = await workerService.getRoles(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(roles));
});

export const addRole = asyncHandler(async (req: Request, res: Response) => {
    const { idWorker, idRole } = req.params;
    const relation = await workerService.addRole(idWorker, idRole);
    res.status(HTTPCODES.CREATED).json(serializeBigInt(relation));
});

export const removeRole = asyncHandler(async (req: Request, res: Response) => {
    const { idWorker, idRole } = req.params;
    const relation = await workerService.removeRole(idWorker, idRole);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(relation));
});

//================================
// Auth Functions
//================================
export const login = asyncHandler(async (req: Request, res: Response) => {
    const body = loginWorkerSchema.parse(req.body);
    const token = await workerService.login(body);
    res.status(HTTPCODES.OK).json({token: serializeBigInt(token)});
});