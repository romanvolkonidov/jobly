ALTER TABLE "User" 
ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

ALTER TABLE "User"
DROP COLUMN "name";

-- Update PendingUser table
ALTER TABLE "PendingUser" 
ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

ALTER TABLE "PendingUser"
DROP COLUMN "name";