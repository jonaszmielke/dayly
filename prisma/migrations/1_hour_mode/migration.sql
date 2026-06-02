-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "endHour" INTEGER,
ADD COLUMN     "startHour" INTEGER,
ADD COLUMN     "timezone" TEXT,
ALTER COLUMN "deadline" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "hours" TIMESTAMPTZ[];
