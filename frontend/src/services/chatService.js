import api from "./api";

export const getMessages = async (groupId) => {
  const response = await api.get(`/chat/${groupId}`);
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await api.post("/chat", data);
  return response.data;
};