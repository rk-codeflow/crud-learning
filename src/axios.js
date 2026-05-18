import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  // timeout: 5000,
  // headers: { "X-Custom-Header": "foobar" },
});

// get request
export const fetchData = async () => {
  try {
    const res = await api.get("/posts");
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// create request
export const createPost = async (post) => {
  try {
    const res = await api.post("/posts", post);
    return res.data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};

// update request
export const updatePost = async (id) => {
  try {
    const res = await api.put(`/posts/${id}`);
    console.log("update", res);
  } catch (error) {
    console.error("Error updating data", error);
  }
};

// delete
export const deletePost = async (id) => {
  try {
    return await api.delete(`/posts/${id}`);
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};
