import { createUser } from "./user/create-user-mutation";
import { loginUser } from "./user/login-user-mutation";
import { updateUser } from "./user/update-user-mutation";
import { PsychologistMutations } from "./psychologist";
import { createAppointment } from "./appointment/create-appointment";

export const Mutation = {
  sayHello: (_: unknown, { name }: { name: string }) => `Hello, ${name}!`,
  createUser,
  loginUser,
  updateUser,
  createAppointment,
  ...PsychologistMutations,
};

