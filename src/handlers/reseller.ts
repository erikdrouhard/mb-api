import { Request, Response, NextFunction } from 'express';
import prisma from '../db';

export async function getResellers(req: Request, res: Response, next: NextFunction) {
  try {
    const resellers = await prisma.reseller.findMany();
    res.json({ data: resellers });
  } catch (e) {
    next(e);
  }
}

export async function getOneReseller(req: Request, res: Response, next: NextFunction) {
  try {
    const reseller = await prisma.reseller.findFirst({
      where: {
        resellerId: req.params.resellerId as string,
      },
    });

    if (!reseller) {
      res.status(404).json({ message: 'Reseller not found' });
      return;
    }

    res.json({ data: reseller });
  } catch (e) {
    next(e);
  }
}

export async function createReseller(req: Request, res: Response, next: NextFunction) {
  try {
    const reseller = await prisma.reseller.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        backerId: req.body.backerId,
        resellerId: req.body.resellerId,
        pledgeAmount: req.body.pledgeAmount,
        backerNumber: req.body.backerNumber,
      },
    });

    res.status(201).json({ data: reseller });
  } catch (e) {
    next(e);
  }
}

export async function updateReseller(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await prisma.reseller.update({
      where: {
        id: req.params.id as string,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        licenseDuration: req.body.licenseDuration,
      },
    });

    res.json({ data: updated });
  } catch (e) {
    next(e);
  }
}

export async function deleteReseller(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await prisma.reseller.delete({
      where: {
        id: req.params.id as string,
      },
    });

    res.json({ data: deleted });
  } catch (e) {
    next(e);
  }
}
