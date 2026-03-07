import { JobsControllerV1 } from "./jobs/JobsControllerV1";
import { JobsRepositoryV1 } from "./jobs/JobsRepositoryV1";
import { JobsServiceV1 } from "./jobs/JobsServiceV1";
import { MessagingControllerV1 } from "./messaging/MessagingControllerV1";
import { MessagingRepositoryV1 } from "./messaging/MessagingRepositoryV1";
import { MessagingServiceV1 } from "./messaging/MessagingServiceV1";
import { SocialControllerV1 } from "./social/SocialControllerV1";
import { SocialRepositoryV1 } from "./social/SocialRepositoryV1";
import { SocialServiceV1 } from "./social/SocialServiceV1";
import { UserControllerV1 } from "./users/UserControllerV1";
import { UserRepositoryV1 } from "./users/UserRepositoryV1";
import { UserServiceV1 } from "./users/UserServiceV1";

const userRepository = new UserRepositoryV1();
const userService = new UserServiceV1(userRepository);
export const userControllerV1 = new UserControllerV1(userService);

const socialRepository = new SocialRepositoryV1();
const socialService = new SocialServiceV1(socialRepository);
export const socialControllerV1 = new SocialControllerV1(socialService);

const jobsRepository = new JobsRepositoryV1();
const jobsService = new JobsServiceV1(jobsRepository);
export const jobsControllerV1 = new JobsControllerV1(jobsService);

const messagingRepository = new MessagingRepositoryV1();
const messagingService = new MessagingServiceV1(messagingRepository);
export const messagingControllerV1 = new MessagingControllerV1(messagingService);
