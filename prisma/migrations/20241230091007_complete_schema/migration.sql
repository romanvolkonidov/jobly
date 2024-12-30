-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completedTasks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'open',
    "location" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "proposal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Bid_taskId_idx" ON "Bid"("taskId");

-- CreateIndex
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");

-- CreateIndex
CREATE INDEX "Review_fromUserId_idx" ON "Review"("fromUserId");

-- CreateIndex
CREATE INDEX "Review_toUserId_idx" ON "Review"("toUserId");

-- CreateIndex
CREATE INDEX "Review_taskId_idx" ON "Review"("taskId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
