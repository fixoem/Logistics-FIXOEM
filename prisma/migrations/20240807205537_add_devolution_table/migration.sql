-- CreateTable
CREATE TABLE "Devolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "mainReason" TEXT NOT NULL,
    "sucursal" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "ticketNumber" INTEGER NOT NULL,
    "clientNumber" INTEGER NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DevolutionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "devolutionId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "DevolutionItem_devolutionId_fkey" FOREIGN KEY ("devolutionId") REFERENCES "Devolution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DevolutionImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "devolutionId" INTEGER NOT NULL,
    CONSTRAINT "DevolutionImage_devolutionId_fkey" FOREIGN KEY ("devolutionId") REFERENCES "Devolution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comentarios" TEXT NOT NULL,
    "ndc" INTEGER NOT NULL,
    "devolutionId" INTEGER NOT NULL,
    CONSTRAINT "Resolution_devolutionId_fkey" FOREIGN KEY ("devolutionId") REFERENCES "Devolution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResolutionImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resolutionId" INTEGER NOT NULL,
    CONSTRAINT "ResolutionImage_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "Resolution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Resolution_devolutionId_key" ON "Resolution"("devolutionId");
