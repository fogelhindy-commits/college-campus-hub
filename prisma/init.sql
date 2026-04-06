-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hostEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "studentId" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "balanceDue" INTEGER NOT NULL,
    "nextInvoiceDate" DATETIME NOT NULL,
    CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CampusClass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "teacherId" TEXT,
    "liveForDays" INTEGER NOT NULL,
    "recordingLiveForDays" INTEGER NOT NULL,
    "meetingId" TEXT,
    "joinUrl" TEXT,
    "hostUrl" TEXT,
    CONSTRAINT "CampusClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "sessionLabel" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "present" INTEGER NOT NULL,
    "absent" INTEGER NOT NULL,
    "participationRate" INTEGER NOT NULL,
    CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL,
    "availableUntil" DATETIME NOT NULL,
    "uploadedById" TEXT NOT NULL,
    CONSTRAINT "Recording_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Recording_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "audienceStudentIds" TEXT NOT NULL,
    CONSTRAINT "ClassNote_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "dataUrl" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "audienceStudentIds" TEXT NOT NULL,
    CONSTRAINT "ClassFile_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CampusClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinanceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "FinanceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BillingDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientId" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,
    CONSTRAINT "BillingDocument_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OwnerSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultClassLiveForDays" INTEGER NOT NULL,
    "defaultRecordingLiveForDays" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "QuickBooksConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "realmId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "companyName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessTokenExpiresAt" DATETIME NOT NULL,
    "refreshTokenExpiresAt" DATETIME NOT NULL,
    "connectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSyncedAt" DATETIME
);

-- CreateTable
CREATE TABLE "AppState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_classId_studentId_key" ON "Enrollment"("classId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "QuickBooksConnection_realmId_key" ON "QuickBooksConnection"("realmId");

