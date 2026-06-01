import { opsDb } from '../src/lib/prisma';

async function main() {
  try {
    const standards = await opsDb.maintenanceStandard.findMany({
      include: { items: true }
    });
    console.log("=== MAINTENANCE STANDARDS ===");
    console.log(`Total standards found: ${standards.length}`);
    standards.forEach(std => {
      console.log(`- ID: ${std.id}, Name: ${std.name}, Freq: ${std.frequency}, Items count: ${std.items.length}`);
    });

    const inspections = await opsDb.inspectionDetail.findMany();
    console.log("\n=== INSPECTIONS ===");
    console.log(`Total inspections: ${inspections.length}`);
    inspections.forEach(insp => {
      console.log(`- ID: ${insp.id}, Title: ${insp.title}, Date: ${insp.date}`);
    });
  } catch (error) {
    console.error("Prisma query failed:", error);
  } finally {
    await opsDb.$disconnect();
  }
}

main();
