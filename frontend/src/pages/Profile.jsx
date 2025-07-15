import React, { useState } from "react";
import { useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import PetCard from "@/components/profile/PetCard";
import AddPetModal from "@/components/profile/AddPetModal";
import EditPetModal from "@/components/profile/EditPetModal";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAddPet, setShowAddPet] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/profile/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();

        setUserProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location || "Need to update code",
          bio: data.bio || "Need to update code",
          profileImage: data.photoURL || "https://via.placeholder.com/150",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/pet/myPets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch pets");
        const data = await res.json();

        setPets(data); // assuming API returns an array of pet objects
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, []);

  const [newPet, setNewPet] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    weight: "",
    status: "Available",
    adoptionType: "Permanent",
    description: "",
    medicalHistory: "",
    traits: [],
    images: [],
  });

  const handleProfileUpdate = () => {
    setEditingProfile(false);
  };

  const handleAddPet = () => {
    if (newPet.name && newPet.breed) {
      const pet = {
        ...newPet,
        id: pets.length + 1,
        images:
          newPet.images.length > 0
            ? newPet.images
            : [
                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop",
              ],
      };
      setPets([...pets, pet]);
      setNewPet({
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        weight: "",
        status: "Available",
        adoptionType: "Permanent",
        description: "",
        medicalHistory: "",
        traits: [],
        images: [],
      });
      setShowAddPet(false);
    }
  };

  const handlePetUpdate = () => {
    setPets(pets.map((pet) => (pet.id === selectedPet.id ? selectedPet : pet)));
    setSelectedPet(null);
  };

  const handleDeletePet = (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      setPets(pets.filter((p) => p.id !== petId));
      setSelectedPet(null);
    }
  };

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          petsCount={pets.length}
        />
        {activeTab === "profile" && (
          <ProfileInfo
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            editingProfile={editingProfile}
            setEditingProfile={setEditingProfile}
            handleProfileUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === "pets" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
                <button
                  onClick={() => setShowAddPet(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Pet
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  setSelectedPet={setSelectedPet}
                />
              ))}
            </div>
          </div>
        )}
        {showAddPet && (
          <AddPetModal
            newPet={newPet}
            setNewPet={setNewPet}
            handleAddPet={handleAddPet}
            setShowAddPet={setShowAddPet}
          />
        )}
        {selectedPet && (
          <EditPetModal
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
            handlePetUpdate={handlePetUpdate}
            handleDeletePet={handleDeletePet}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
