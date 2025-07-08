export type UserProfile = {
  clerkId: string;
  username: string | null;
  imageUrl: string | null;
  email: string;
};

export type Chat = {
  chatId: string;
  otherUser: UserProfile;
  lastMessage: {
    text: string;
    createdAt: string;
  } | null;
};
