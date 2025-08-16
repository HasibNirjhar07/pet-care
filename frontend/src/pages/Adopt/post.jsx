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
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [currentAdoptionRequests, setCurrentAdoptionRequests] = useState([]);
  const [selectedPostForRequests, setSelectedPostForRequests] = useState(null);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] =
    useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

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
      const res = await fetch(`http://localhost:3000/adoption/${adoptionId}`, {
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
        `http://localhost:3000/adoption/${currentPost._id}`,
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
  const handleViewRequests = async (adoptionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/${adoptionId}/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch adoption requests");
      const data = await res.json();
      setCurrentAdoptionRequests(data);
      setSelectedPostForRequests(adoptionId);
      setShowRequestsModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/request/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to reject adoption request");
      alert("Adoption request rejected successfully!");
      // Refresh requests for the current post
      handleViewRequests(selectedPostForRequests);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScheduleMeeting = (request) => {
    setCurrentRequestId(request._id);
    setMeetingDate(
      request.meetingDate
        ? new Date(request.meetingDate).toISOString().split("T")[0]
        : ""
    );
    setMeetingNotes(request.notes || "");
    setShowScheduleMeetingModal(true);
  };

  const handleSaveMeeting = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/schedule-meeting/${currentRequestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meetingDate,
            notes: meetingNotes,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to schedule meeting");
      alert("Meeting scheduled successfully!");
      setShowScheduleMeetingModal(false);
      // Refresh requests for the current post
      handleViewRequests(selectedPostForRequests);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDealCompleted = async (requestId, adoptionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/${adoptionId}/status-confirmed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId }),
        }
      );
      if (!res.ok) throw new Error("Failed to complete deal");
      alert("Deal completed! Pet ownership transferred.");
      setShowRequestsModal(false);
      fetchPosts(); // Refresh all posts
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
          >
            <img
              src={`http://localhost:3000${post.PetID.photos[0]}`}
              alt={`${post.PetID.name}`}
              className="w-full md:w-1/3 h-64 object-cover"
            />
            <div className="p-4 flex-1">
              <h2 className="text-2xl font-bold mb-2">{post.PetID.name}</h2>
              <p className="text-gray-700 mb-4">{post.AdoptionDescription}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
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
              <div className="flex flex-wrap gap-2">
                <Link to={`/pet/${post.PetID._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    View Pet Info
                  </button>
                </Link>
                <button
                  onClick={() => handleViewRequests(post._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  View Adoption Requests
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Post Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* View Adoption Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Adoption Requests</h2>
            {currentAdoptionRequests.length === 0 ? (
              <p>No adoption requests for this post yet.</p>
            ) : (
              <div className="space-y-4">
                {currentAdoptionRequests.map((request) => (
                  <div
                    key={request._id}
                    className="border p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        Requester: {request.requesterId.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {request.requesterId.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {request.requesterId.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {request.status}
                      </p>
                      {request.meetingDate && (
                        <p className="text-sm text-gray-600">
                          Meeting Date:{" "}
                          {new Date(request.meetingDate).toLocaleDateString()}
                        </p>
                      )}
                      {request.notes && (
                        <p className="text-sm text-gray-600">
                          Notes: {request.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleScheduleMeeting(request)}
                        className={`px-3 py-1 rounded-md ${
                          request.status === "meet scheduled"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                      >
                        {request.status === "meet scheduled"
                          ? "Edit Meeting"
                          : "Schedule Meeting"}
                      </button>
                      <button
                        onClick={() =>
                          handleDealCompleted(
                            request._id,
                            selectedPostForRequests
                          )
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        Deal Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRequestsModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Schedule Meeting</h2>
            <label
              htmlFor="meetingDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Meeting Date:
            </label>
            <input
              type="date"
              id="meetingDate"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <label
              htmlFor="meetingNotes"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Notes:
            </label>
            <textarea
              id="meetingNotes"
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Add any notes for the meeting..."
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setShowScheduleMeetingModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeeting}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
