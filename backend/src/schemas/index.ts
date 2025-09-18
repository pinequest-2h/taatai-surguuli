import { mergeTypeDefs } from "@graphql-tools/merge";

import { commonTypeDefs } from "./common.schema";
import { userTypeDefs } from "./user.schema";
import { sessionTypeDefs } from "./session.schema";
import { messageTypeDefs } from "./message.schema";
import { feedbackTypeDefs } from "./feedback.schema";
import { psychologistTypeDefs } from "./psychologist.schema";
import { childTypeDefs } from "./child.schema";
import { followTypeDefs } from "./follow.schema";
import { chatroomTypeDefs } from "./chatroom.schema";

export const typeDefs = mergeTypeDefs([
  commonTypeDefs,
  userTypeDefs,
  sessionTypeDefs,
  messageTypeDefs,
  feedbackTypeDefs,
  psychologistTypeDefs,
  childTypeDefs,
  followTypeDefs,
  chatroomTypeDefs,
]);
