import { axiosInstance } from "./axios";

//authicated user
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in authentication", error);
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
export const acceptFriendReqs = async (requestId)=>{
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}
export const getStreamToken = async ()=>{
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
