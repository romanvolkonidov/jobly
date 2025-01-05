-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "category" TEXT,
ADD COLUMN     "subcategory" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "portfolioImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "portfolioVideo" TEXT,
ADD COLUMN     "taskRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "verificationCode" TEXT;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "bidId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_fromUserId_idx" ON "Message"("fromUserId");

-- CreateIndex
CREATE INDEX "Message_toUserId_idx" ON "Message"("toUserId");

-- CreateIndex
CREATE INDEX "Message_taskId_idx" ON "Message"("taskId");

-- CreateIndex
CREATE INDEX "Message_bidId_idx" ON "Message"("bidId");

-- CreateIndex
CREATE INDEX "Task_category_idx" ON "Task"("category");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
