import api from "./api";
export const getAllNotes = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/notes", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.notes;
};

export const uploadNote = async (formData) => {

    const token = localStorage.getItem("token");

    const response = await api.post("/notes", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};
export const deleteNote = async (noteId) => {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/notes/${noteId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};