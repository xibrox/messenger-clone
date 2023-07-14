"use client";

import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find, remove } from "lodash";
import MessageBox from "./MessageBox";
import useConversation from "@/app/hooks/useConversation";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) =>
          currentMessage.id === newMessage.id ? newMessage : currentMessage
        )
      );
    };

    const removeMessageHandler = (deletedMessage: FullMessageType) => {
      setMessages((current) => {
        remove(current, { id: deletedMessage.id });
        return [...current];
      });
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    pusherClient.bind("message:remove", removeMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
      pusherClient.unbind("message:remove", removeMessageHandler);
    };
  }, [conversationId]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete(`/api/messages/${messageId}`);
      if (response.status === 200) {
        setMessages((current) =>
          current.filter((message) => message.id !== messageId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          onDelete={() => handleDeleteMessage(message.id)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Body;