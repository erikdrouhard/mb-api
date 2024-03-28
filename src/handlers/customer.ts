import prisma from '../db';

// Gets all customers
export async function getCustomers(req, res) {
  const customer = await prisma.customer.findMany({
    where: {
      id: req.customer.id,
    },
  });

  res.json({ data: customer });
}

// Get one customer
export async function getOneCustomer(req, res) {
  const id = req.params.id;
  const customer = await prisma.customer.findFirst({
    where: {
      id,
      resellerId: req.customer.resellerId,
    },
  });

  res.json({ data: customer });
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
  const updated = await prisma.customer.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.json({ data: updated });
}

// Delete a customer
export async function deleteCustomer(req, res) {
  const deleted = await prisma.customer.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleted });
}
