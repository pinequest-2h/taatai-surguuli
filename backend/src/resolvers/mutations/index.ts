import { createUser } from "./user/create-user-mutation";
import { loginUser } from "./user/login-user-mutation";
import { updateUser } from "./user/update-user-mutation";
import { PsychologistMutations } from "./psychologist";
import { createChatroom, sendChatroomMessage, markChatroomMessagesAsRead } from "./chatroom/send-chatroom-message";
import { createReport } from "./report/create-report";
import { updateReport } from "./report/update-report";
import { deleteReport } from "./report/delete-report";

export const Mutation = {
  sayHello: (_: unknown, { name }: { name: string }) => `Hello, ${name}!`,
  createUser,
  loginUser,
  updateUser,
  createChatroom,
  sendChatroomMessage,
  markChatroomMessagesAsRead,
  createReport,
  updateReport,
  deleteReport,
  ...PsychologistMutations,
};

