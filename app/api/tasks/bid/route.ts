import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { taskId, amount, proposal } = await req.json();

    // Get task and task owner details
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { createdBy: true }
    });

    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Create bid and message in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the bid
      const bid = await tx.bid.create({
        data: {
          amount,
          proposal,
          taskId,
          userId: user.id,
          status: 'pending'
        }
      });

      // Create initial message
      await tx.message.create({
        data: {
          content: `New proposal submitted: ${proposal}\nBid amount: KES ${amount}`,
          fromUserId: user.id,
          toUserId: task.userId,
          taskId,
          bidId: bid.id
        }
      });

      return bid;
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Bid submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit bid' }), 
      { status: 500 }
    );
  }
}
