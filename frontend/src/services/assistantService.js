import api from "./api";

export const getAssistantResponse = async (question) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/assistant/chat",
    { question },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
