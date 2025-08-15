import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedReturnDate, setEditedReturnDate] = useState("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/adoption/myPosts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch adoption posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (adoptionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/adopt/${adoptionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete adoption post");
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setEditedDescription(post.AdoptionDescription);
    setEditedType(post.adoptionType);
    setEditedReturnDate(
      post.ReturnDate
        ? new Date(post.ReturnDate).toISOString().split("T")[0]
        : ""
    );
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adopt/${currentPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adoptionDescription: editedDescription,
            adoptionType: editedType,
            returnDate: editedReturnDate,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update adoption post");
      setEditModalOpen(false);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{post.PetID.name}</h2>
              <img
                src={`http://localhost:3000${post.PetID.photos[0]}`}
                alt={`${post.PetID.name}`}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-gray-700 mb-4">{post.AdoptionDescription}</p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Species:</strong> {post.PetID.species}
                </p>
                <p>
                  <strong>Age:</strong>{" "}
                  {new Date().getFullYear() -
                    new Date(post.PetID.dateOfBirth).getFullYear()}{" "}
                  years
                </p>
                <p>
                  <strong>Breed:</strong> {post.PetID.breed}
                </p>
                <p>
                  <strong>Color:</strong> {post.PetID.color}
                </p>
                <p>
                  <strong>Adoption Type:</strong> {post.adoptionType}
                </p>
                {post.adoptionType === "temporary" && (
                  <p>
                    <strong>Return Date:</strong>{" "}
                    {new Date(post.ReturnDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-100 flex justify-between items-center">
              <Link to={`/pet/${post.PetID._id}`}>
                <button className="text-blue-500 hover:underline">
                  View Pet Info
                </button>
              </Link>
              <div>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-gray-600 hover:text-gray-900 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Adoption Post</h2>
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Adoption Description"
            />
            <input
              type="text"
              value={editedType}
              onChange={(e) => setEditedType(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Adoption Type"
            />
            {editedType === "temporary" && (
              <input
                type="date"
                value={editedReturnDate}
                onChange={(e) => setEditedReturnDate(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setEditModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
