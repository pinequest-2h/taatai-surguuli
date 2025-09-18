import { createUser } from "./user/create-user-mutation";
import { loginUser } from "./user/login-user-mutation";
import { updateUser } from "./user/update-user-mutation";
import { PsychologistMutations } from "./psychologist";
import { createChatroom, sendChatroomMessage, markChatroomMessagesAsRead } from "./chatroom/send-chatroom-message";

export const Mutation = {
  sayHello: (_: unknown, { name }: { name: string }) => `Hello, ${name}!`,
  createUser,
  loginUser,
  updateUser,
  createChatroom,
  sendChatroomMessage,
  markChatroomMessagesAsRead,
  ...PsychologistMutations,
};

