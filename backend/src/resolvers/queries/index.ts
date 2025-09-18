import { getPsychologists, getPsychologistById, searchPsychologists } from "./psychologist/get-psychologists";
import { getPsychologistProfile, getPsychologistProfiles, getAvailablePsychologists } from "./psychologist/get-psychologist-profile";
import { getUserById } from "./user/get-user-by-id";
import { getChatrooms, getChatroomById, getChatroomMessages, getOrCreateChatroom } from "./chatroom/get-chatrooms";

export const Query = {
  hello: () => "Hello from GraphQL!",
  getUserById,
  getPsychologists,
  getPsychologistById,
  searchPsychologists,
  getPsychologistProfile,
  getPsychologistProfiles,
  getAvailablePsychologists,
  getChatrooms,
  getChatroomById,
  getChatroomMessages,
  getOrCreateChatroom,
};
