import { useEffect, useState } from "react";
import { createPost, deletePost, fetchData, updatePost } from "../axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [editPostID, setEditPostID] = useState(null);
  const [fakeData, setFakeData] = useState({
    title: "",
    body: "",
  });

  const resetForm = () => {
    setEditPostID(null);
    setFakeData({
      title: "",
      body: "",
    });
  };

  useEffect(() => {
    fetchData().then((data) => {
      setPosts([...data].sort((a, b) => b.id - a.id));
    });
  }, []);

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts((newPosts) => newPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFakeData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fakeData.title.trim() || !fakeData.body.trim()) {
      return;
    }

    try {
      if (editPostID !== null) {
        const updatedPost = await updatePost(editPostID, fakeData);
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === editPostID ? { ...post, ...updatedPost } : post
          )
        );
      } else {
        const newPost = await createPost(fakeData);
        setPosts((currentPosts) => [newPost, ...currentPosts]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving post", error);
    }
  };

  const handleEditPost = (id) => {
    const selectedPost = posts.find((post) => post.id === id);

    if (selectedPost) {
      setEditPostID(id);
      setFakeData({
        title: selectedPost.title,
        body: selectedPost.body,
      });
    }
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            name="title"
            id="title"
            value={fakeData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input
            type="text"
            placeholder="Enter body"
            name="body"
            id="body"
            value={fakeData.body}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editPostID !== null ? "Update Post" : "Create Post"}
        </button>
        {editPostID !== null && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>
      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "deepskyblue",
              color: "white",
              padding: "1rem",
            }}
          >
            <h4 style={{ fontSize: "2rem", fontWeight: "600" }}># {post.id}</h4>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {post.title}
            </p>
            <p style={{ fontSize: "1rem" }}>{post.body}</p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => handleDeletePost(post.id)}>
                Delete
              </button>
              <button type="button" onClick={() => handleEditPost(post.id)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
