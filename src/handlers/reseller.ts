import { Request, Response, NextFunction } from 'express';
import { resellerService } from '../services/reseller.service';

export async function getResellers(req: Request, res: Response, next: NextFunction) {
  try {
    const resellers = await resellerService.getAll();
    res.json({ data: resellers });
  } catch (e) {
    next(e);
  }
}

export async function getOneReseller(
  req: Request<{ resellerId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const reseller = await resellerService.getOne(req.params.resellerId);
    res.json({ data: reseller });
  } catch (e) {
    next(e);
  }
}

export async function createReseller(req: Request, res: Response, next: NextFunction) {
  try {
    const reseller = await resellerService.create({
      name: req.body.name,
      email: req.body.email,
      backerId: req.body.backerId,
      resellerId: req.body.resellerId,
      pledgeAmount: req.body.pledgeAmount,
      backerNumber: req.body.backerNumber,
    });
    res.status(201).json({ data: reseller });
  } catch (e) {
    next(e);
  }
}

export async function updateReseller(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const updated = await resellerService.update(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      licenseDuration: req.body.licenseDuration,
    });
    res.json({ data: updated });
  } catch (e) {
    next(e);
  }
}

export async function deleteReseller(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await resellerService.remove(req.params.id);
    res.json({ data: deleted });
  } catch (e) {
    next(e);
  }
}
