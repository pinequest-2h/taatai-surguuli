import { getPsychologists, getPsychologistById, searchPsychologists } from "./psychologist/get-psychologists";
import { getPsychologistProfile, getPsychologistProfiles, getAvailablePsychologists } from "./psychologist/get-psychologist-profile";
import { getUserById } from "./user/get-user-by-id";
import { getUpcomingAppointments } from "./appointment/get-upcoming-appointments";
import { getAppointments, getPsychologistAppointments, getChildAppointments } from "./appointment/get-appointments";

export const Query = {
  hello: () => "Hello from GraphQL!",
  getUserById,
  getPsychologists,
  getPsychologistById,
  searchPsychologists,
  getPsychologistProfile,
  getPsychologistProfiles,
  getAvailablePsychologists,
  getUpcomingAppointments,
  getAppointments,
  getPsychologistAppointments,
  getChildAppointments,
};
