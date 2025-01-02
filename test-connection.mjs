import { PrismaClient } from '@prisma/client'

const testConnection = async () => {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    await prisma.user.findFirst()
    console.log('✓ Database operations working')
  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
}

testConnection()