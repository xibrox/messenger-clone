import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  messageId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { messageId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the message before deleting it
    const messageToDelete = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!messageToDelete) {
      return new NextResponse("Invalid Message ID", { status: 400 });
    }

    // Delete the message
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    // Trigger the event for message deletion to relevant users
    messageToDelete.conversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "message:remove", {
          message: deletedMessage,
        });
      }
    });

    return new NextResponse(JSON.stringify(deletedMessage), { status: 200 });
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGE_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}