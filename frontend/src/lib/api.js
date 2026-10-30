import { axiosInstance } from "./axios";

//authicated user
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
};

export const signup = async (data) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const onBordingFn = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

//update name, bio, languages, location or profile picture
export const updateProfile = async (userData) => {
  const response = await axiosInstance.put("/users/me", userData);
  return response.data;
};

//for getting friends we have so far
export const getFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

//all other users that have account on it
export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

//Friend Requests that we have sent
export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

//Requests that someone sent us
export const getSendRequests = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

//for notifications get Friend Requests
export const getFriendReq = async () => {
  const response = await axiosInstance.get(`/users/friend-requests`);
  return response.data;
};

//accept Friend requests
export const acceptFriendReqs = async (requestId) => {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
};

//remember that the user has opened the notifications page
export const markNotificationsSeen = async () => {
  const response = await axiosInstance.put("/users/notifications/seen");
  return response.data;
};

export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

// ---- blocking ----
export const blockUser = async (userId) => {
  const response = await axiosInstance.post(`/users/${userId}/block`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/${userId}/block`);
  return response.data;
};

export const getBlockedUsers = async () => {
  const response = await axiosInstance.get("/users/blocked");
  return response.data;
};

// ---- groups ----
export const createGroup = async ({ name, memberIds, image }) => {
  const response = await axiosInstance.post("/chat/groups", { name, memberIds, image });
  return response.data;
};

export const updateGroup = async ({ channelId, name, image }) => {
  const response = await axiosInstance.put(`/chat/groups/${channelId}`, { name, image });
  return response.data;
};

export const addGroupMembers = async ({ channelId, memberIds }) => {
  const response = await axiosInstance.post(`/chat/groups/${channelId}/members`, { memberIds });
  return response.data;
};

export const removeGroupMember = async ({ channelId, userId }) => {
  const response = await axiosInstance.delete(`/chat/groups/${channelId}/members/${userId}`);
  return response.data;
};

export const getBlockStatus = async () => {
  const response = await axiosInstance.get("/users/block-status");
  return response.data;
};
