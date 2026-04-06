import { prisma } from "../src/lib/prisma";
import { ensureAuthAccount } from "../src/lib/auth-store";

async function main() {
  await prisma.appState.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      data: JSON.stringify({
        users: [
          {
            id: "owner-olivia",
            name: "Olivia Carter",
            email: "olivia@campus-hub.edu",
            role: "owner",
            title: "Campus owner",
            zoomEmail: "olivia.carter@campus-hub.edu",
          },
          {
            id: "teacher-taylor",
            name: "Taylor Brooks",
            email: "taylor@campus-hub.edu",
            role: "teacher",
            title: "Lead teacher",
            zoomEmail: "taylor.brooks@campus-hub.edu",
          },
          {
            id: "teacher-jordan",
            name: "Jordan Lee",
            email: "jordan@campus-hub.edu",
            role: "teacher",
            title: "Adjunct instructor",
            zoomEmail: "jordan.lee@campus-hub.edu",
          },
          {
            id: "secretary-sam",
            name: "Sam Rivera",
            email: "sam@campus-hub.edu",
            role: "secretary",
            title: "Finance secretary",
            zoomEmail: null,
          },
          {
            id: "student-mia",
            name: "Mia Lopez",
            email: "mia@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
          {
            id: "student-noah",
            name: "Noah Reed",
            email: "noah@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
          {
            id: "student-ava",
            name: "Ava Patel",
            email: "ava@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
        ],
        payments: {
          "student-mia": {
            studentId: "student-mia",
            plan: "Campus Plus",
            status: "paid",
            balanceDue: 0,
            nextInvoiceDate: "2026-04-26",
          },
          "student-noah": {
            studentId: "student-noah",
            plan: "Campus Plus",
            status: "unpaid",
            balanceDue: 1250,
            nextInvoiceDate: "2026-03-29",
          },
          "student-ava": {
            studentId: "student-ava",
            plan: "Evening Scholar",
            status: "paid",
            balanceDue: 0,
            nextInvoiceDate: "2026-04-19",
          },
        },
      }),
    },
    update: {
      data: JSON.stringify({
        users: [
          {
            id: "owner-olivia",
            name: "Olivia Carter",
            email: "olivia@campus-hub.edu",
            role: "owner",
            title: "Campus owner",
            zoomEmail: "olivia.carter@campus-hub.edu",
          },
          {
            id: "teacher-taylor",
            name: "Taylor Brooks",
            email: "taylor@campus-hub.edu",
            role: "teacher",
            title: "Lead teacher",
            zoomEmail: "taylor.brooks@campus-hub.edu",
          },
          {
            id: "teacher-jordan",
            name: "Jordan Lee",
            email: "jordan@campus-hub.edu",
            role: "teacher",
            title: "Adjunct instructor",
            zoomEmail: "jordan.lee@campus-hub.edu",
          },
          {
            id: "secretary-sam",
            name: "Sam Rivera",
            email: "sam@campus-hub.edu",
            role: "secretary",
            title: "Finance secretary",
            zoomEmail: null,
          },
          {
            id: "student-mia",
            name: "Mia Lopez",
            email: "mia@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
          {
            id: "student-noah",
            name: "Noah Reed",
            email: "noah@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
          {
            id: "student-ava",
            name: "Ava Patel",
            email: "ava@campus-hub.edu",
            role: "student",
            title: "Student",
            zoomEmail: null,
          },
        ],
        payments: {
          "student-mia": {
            studentId: "student-mia",
            plan: "Campus Plus",
            status: "paid",
            balanceDue: 0,
            nextInvoiceDate: "2026-04-26",
          },
          "student-noah": {
            studentId: "student-noah",
            plan: "Campus Plus",
            status: "unpaid",
            balanceDue: 1250,
            nextInvoiceDate: "2026-03-29",
          },
          "student-ava": {
            studentId: "student-ava",
            plan: "Evening Scholar",
            status: "paid",
            balanceDue: 0,
            nextInvoiceDate: "2026-04-19",
          },
        },
      }),
    },
  });

  const demoPassword = process.env.SEED_DEMO_PASSWORD?.trim() || "ChangeMe123!";

  const demoUsers = [
    { id: "owner-olivia", email: "olivia@campus-hub.edu" },
    { id: "teacher-taylor", email: "taylor@campus-hub.edu" },
    { id: "teacher-jordan", email: "jordan@campus-hub.edu" },
    { id: "secretary-sam", email: "sam@campus-hub.edu" },
    { id: "student-mia", email: "mia@campus-hub.edu" },
    { id: "student-noah", email: "noah@campus-hub.edu" },
    { id: "student-ava", email: "ava@campus-hub.edu" },
  ];

  for (const user of demoUsers) {
    await ensureAuthAccount({
      userId: user.id,
      email: user.email,
      password: demoPassword,
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
