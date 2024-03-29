import prisma from '../db';

// Gets all resellers
export async function getResellers(req, res) {
  try {
    const reseller = await prisma.reseller.findMany();

    res.json({ data: reseller });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ message: 'Oops...something went wrong' });
  }
}

// Get one reseller
export async function getOneReseller(req, res) {
  try {
    const reseller = await prisma.reseller.findFirst({
      where: {
        id: req.params.id,
        resellerId: req.params.resellerId,
      },
    });

    res.json({ data: reseller });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Reseller not found.' });
  }
}

// Create a reseller
// backerId        String   @unique
// licenseDuration String   @default("2")
// name            String
// email           String   @unique
// resellerId      String   @unique

// pledgeAmount String? //optional
// backerNumber String? //optional
export async function createReseller(req, res, next) {
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

    res.json({ data: reseller });
  } catch (e) {
    next(e);
  }
}

// Update a reseller
export async function updateReseller(req, res) {
  try {
    const updated = await prisma.reseller.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        licenseDuration: req.body.licenseDuration,
      },
    });

    res.json({ data: updated });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Oops... something went wrong there.' });
  }
}

// Delete a reseller
export async function deleteReseller(req, res) {
  try {
    const deleted = await prisma.reseller.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: deleted });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Oops... something went wrong.' });
  }
}
