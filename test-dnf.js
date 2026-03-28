const { opsDb } = require('./src/lib/prisma');

async function test() {
  try {
    const dnfs = await opsDb.dnfDocument.findMany({
      include: { correctiveActions: true }
    });
    console.log(`Successfully found ${dnfs.length} DNFs with corrective actions.`);
  } catch (err) {
    console.error('Error during findMany:', err);
  } finally {
    await opsDb.$disconnect();
  }
}

test();
