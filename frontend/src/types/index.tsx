export type UserProfile = {
  clerkId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
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

export type Message = {
  id: string;
  text: string;
  createdAt: string;
  chatId: string;
  sender: {
    clerkId: string;
    username: string | null;
    imageUrl: string | null;
  };
};
