-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comentarios" TEXT NOT NULL,
    "ndc" TEXT NOT NULL,
    "devolutionId" INTEGER NOT NULL,
    CONSTRAINT "Resolution_devolutionId_fkey" FOREIGN KEY ("devolutionId") REFERENCES "Devolution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resolution" ("comentarios", "devolutionId", "id", "ndc") SELECT "comentarios", "devolutionId", "id", "ndc" FROM "Resolution";
DROP TABLE "Resolution";
ALTER TABLE "new_Resolution" RENAME TO "Resolution";
CREATE UNIQUE INDEX "Resolution_devolutionId_key" ON "Resolution"("devolutionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
