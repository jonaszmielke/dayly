-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MeetingMode" AS ENUM ('DAYS', 'HOURS');

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "shortId" TEXT NOT NULL,
    "mode" "MeetingMode" NOT NULL DEFAULT 'DAYS',
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "deadline" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "days" DATE[],
    "meetingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_shortId_key" ON "Meeting"("shortId");

-- CreateIndex
CREATE INDEX "Response_meetingId_idx" ON "Response"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_meetingId_userName_key" ON "Response"("meetingId", "userName");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

