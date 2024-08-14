-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Devolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "mainReason" TEXT NOT NULL,
    "sucursal" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "ticketNumber" INTEGER NOT NULL,
    "clientNumber" INTEGER NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnmentLabel" TEXT NOT NULL,
    "dateProductArrive" DATETIME NOT NULL,
    "shippingPayment" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Devolution" ("clientNumber", "createdAt", "dateProductArrive", "explanation", "id", "mainReason", "orderNumber", "returnmentLabel", "status", "sucursal", "ticketNumber") SELECT "clientNumber", "createdAt", "dateProductArrive", "explanation", "id", "mainReason", "orderNumber", "returnmentLabel", "status", "sucursal", "ticketNumber" FROM "Devolution";
DROP TABLE "Devolution";
ALTER TABLE "new_Devolution" RENAME TO "Devolution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
