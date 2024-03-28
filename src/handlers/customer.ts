import prisma from '../db';

// Gets all customers
export async function getCustomers(req, res) {
  try {
    const customer = await prisma.customer.findMany();

    res.json({ data: customer });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ message: 'Oops...something went wrong' });
  }
}

// Get one customer
export async function getOneCustomer(req, res) {
  try {
    const id = req.params.id;
    const customer = await prisma.customer.findFirst({
      where: {
        id,
        resellerId: req.params.resellerId,
      },
    });

    res.json({ data: customer });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Customer not found.' });
  }
}

// Create a customer
export async function createCustomer(req, res, next) {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        resellerId: req.body.resellerId,
      },
    });

    res.json({ data: customer });
  } catch (e) {
    next(e);
  }
}

// Update a customer
export async function updateCustomer(req, res) {
  try {
    const updated = await prisma.customer.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
      },
    });

    res.json({ data: updated });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Oops... something went wrong there.' });
  }
}

// Delete a customer
export async function deleteCustomer(req, res) {
  try {
    const deleted = await prisma.customer.delete({
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
