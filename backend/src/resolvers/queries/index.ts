import { getPsychologists, getPsychologistById, searchPsychologists } from "./psychologist/get-psychologists";
import { getPsychologistProfile, getPsychologistProfileByUserId, getPsychologistProfiles, getAvailablePsychologists } from "./psychologist/get-psychologist-profile";
import { getUserById } from "./user/get-user-by-id";
import { getChatrooms, getChatroomById, getChatroomMessages, getOrCreateChatroom } from "./chatroom/get-chatrooms";
import { getReports } from "./report/get-reports";
import { getReportById } from "./report/get-report-by-id";
import { getMyReports } from "./report/get-my-reports";
import { getPsychologistReports } from "./report/get-psychologist-reports";

export const Query = {
  hello: () => "Hello from GraphQL!",
  getUserById,
  getPsychologists,
  getPsychologistById,
  searchPsychologists,
  getPsychologistProfile,
  getPsychologistProfileByUserId,
  getPsychologistProfiles,
  getAvailablePsychologists,
  getChatrooms,
  getChatroomById,
  getChatroomMessages,
  getOrCreateChatroom,
  getReports,
  getReportById,
  getMyReports,
  getPsychologistReports,
};
