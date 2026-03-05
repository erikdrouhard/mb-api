import fs from 'fs';
import Papa from 'papaparse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CsvRow {
  backerNumber: string;
  backerId: string;
  name: string;
  email: string;
  pledgeAmount: string;
  resellerId: string;
}

function parseIntOrNull(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

async function main() {
  const file = fs.createReadStream('prisma/modi-boxi-commercial-resellers.csv');
  const rows: CsvRow[] = [];

  Papa.parse(file, {
    header: true,
    step: function (result) {
      rows.push(result.data);
    },
    complete: async function () {
      console.log(rows);

      for (const row of rows) {
        await prisma.reseller.create({
          data: {
            backerNumber: parseIntOrNull(row.backerNumber),
            backerId: row.backerId,
            name: row.name,
            email: row.email,
            pledgeAmount: row.pledgeAmount,
            resellerId: row.resellerId,
          },
        });
      }
      console.log('CSV file successfully processed');
      await prisma.$disconnect();
    },
    error: async function (err) {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    },
  });
}

main();
