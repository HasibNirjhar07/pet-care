import { useState, useEffect } from "react";
import { Camera, Image, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = ({ isAuthenticated = true }) => {
  // State for user data
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [myPets, setMyPets] = useState([]);

  // State for the post form
  const [postText, setPostText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [petSource, setPetSource] = useState(""); // "my-pet" or "found-pet"
  const [selectedPet, setSelectedPet] = useState(""); // Stores the ID of the selected pet
  const [adoptionType, setAdoptionType] = useState("");

  // Found pet fields
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petColor, setPetColor] = useState("");
  const [foundLocation, setFoundLocation] = useState("");

  // Fetch user data (name and avatar)
  useEffect(() => {
    if (!isAuthenticated) {
      setUserName(""); // Clear if not authenticated
      setUserAvatar("https://via.placeholder.com/40"); // Generic placeholder if not authenticated
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("isAuthenticated is true, but no token found.");
          setUserName("User"); // Fallback name
          setUserAvatar("https://via.placeholder.com/40");
          return;
        }

        const res = await fetch("http://localhost:3000/profile/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Unauthorized
            console.error("Authentication failed, user not logged in.");
            setUserName("User");
            setUserAvatar("https://via.placeholder.com/40");
          } else {
            throw new Error(`Failed to fetch user data: ${res.statusText}`);
          }
          return;
        }

        const data = await res.json();
        setUserName(data.name || "User"); // Fallback to 'User' if name is missing
        setUserAvatar(data.photoURL || "https://via.placeholder.com/40"); // Placeholder if no photoURL
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserName("User"); // Default to User on error
        setUserAvatar("https://via.placeholder.com/40"); // Default placeholder
      }
    };
    fetchUserData();
  }, [isAuthenticated]); // Re-run if isAuthenticated changes

  // Fetch user's pets
  useEffect(() => {
    if (!isAuthenticated) {
      setMyPets([]); // Clear pets if not authenticated
      return;
    }

    const fetchMyPets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error(
            "isAuthenticated is true, but no token found for fetching pets."
          );
          setMyPets([]);
          return;
        }

        const response = await fetch("http://localhost:3000/pet/myPets", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setMyPets(result.pets || []);
        } else if (response.status === 404) {
          setMyPets([]); // No pets found
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching pets:", err);
        setMyPets([]); // Ensure pets is always an array even on error
      }
    };
    fetchMyPets();
  }, [isAuthenticated]); // Re-run if isAuthenticated changes

  const resetForm = () => {
    setPostText("");
    setPetSource("");
    setSelectedPet("");
    setAdoptionType("");
    setPetName("");
    setPetSpecies("");
    setPetBreed("");
    setPetAge("");
    setPetColor("");
    setFoundLocation("");
    setMyPets([]); // Reset fetched pets as well
    setShowForm(false);
  };

  const handlePostAdoption = async () => {
    if (!isAuthenticated) {
      alert("Please log in to create an adoption post.");
      return;
    }

    if (!postText || !petSource || !adoptionType) {
      alert(
        "Please fill in all required fields: Post text, Pet source, and Adoption type."
      );
      return;
    }
    // Ensure postText is not just whitespace
    if (!postText.trim()) {
      alert("Please provide a description for the adoption post.");
      return;
    }

    if (petSource === "my-pet" && !selectedPet) {
      alert("Please select your pet.");
      return;
    }

    if (petSource === "found-pet" && !petSpecies) {
      alert("Please specify the species of the found pet.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Token check is already done by isAuthenticated check above, but good for safety.
      if (!token) {
        alert("Authentication token missing. Please log in.");
        return;
      }

      const payload = {
        adoptionDescription: postText,
        adoptionType,
      };

      if (petSource === "my-pet") {
        payload.petId = selectedPet;
      } else if (petSource === "found-pet") {
        payload.petName = petName || "Unknown";
        payload.petSpecies = petSpecies;
        payload.petBreed = petBreed || "Unknown";
        payload.petAge = petAge || "Unknown";
        payload.petColor = petColor || "Unknown";
        payload.foundLocation = foundLocation || "Unknown";
      }

      const response = await fetch("http://localhost:3000/adoption/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      alert("Adoption post created successfully!");
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error("Error creating adoption post:", error);
      alert(`Failed to create adoption post: ${error.message}`);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-md shadow-md border-none">
      <CardContent className="p-4">
        {!showForm ? (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {isAuthenticated && userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
            </Avatar>
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  setShowForm(true);
                } else {
                  alert("Please log in to create an adoption post.");
                }
              }}
              variant="outline"
              className="w-full justify-start text-muted-foreground rounded-full bg-gray-100 hover:bg-gray-200"
            >
              Share a pet for adoption...
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                {isAuthenticated && userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Create Adoption Post</p>
                <p className="text-xs text-muted-foreground">
                  Help a pet find their forever home
                </p>
              </div>
            </div>

            {/* Pet Source Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                What type of pet are you posting about?
              </Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="petSource"
                    value="my-pet"
                    checked={petSource === "my-pet"}
                    onChange={(e) => setPetSource(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">One of my pets</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="petSource"
                    value="found-pet"
                    checked={petSource === "found-pet"}
                    onChange={(e) => setPetSource(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">Found pet (stray/rescued)</span>
                </label>
              </div>
            </div>

            {/* Conditional Fields Based on Pet Source */}
            {petSource === "my-pet" && (
              <div className="space-y-4">
                <div>
                  <Label>Select Your Pet</Label>
                  <Select onValueChange={setSelectedPet} value={selectedPet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from your pets" />
                    </SelectTrigger>
                    <SelectContent>
                      {myPets.map((pet) => (
                        <SelectItem key={pet._id} value={pet._id}>
                          {" "}
                          {/* Use _id for value */}
                          {pet.name} - {pet.breed} ({pet.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {petSource === "found-pet" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Pet Name (if known)</Label>
                    <Input
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Unknown"
                    />
                  </div>
                  <div>
                    <Label>Species</Label>
                    <Select onValueChange={setPetSpecies} value={petSpecies}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="rabbit">Rabbit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Breed (if known)</Label>
                    <Input
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      placeholder="Mixed/Unknown"
                    />
                  </div>
                  <div>
                    <Label>Estimated Age</Label>
                    <Input
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      placeholder="e.g., 2 years, puppy, adult"
                    />
                  </div>
                  <div>
                    <Label>Color/Appearance</Label>
                    <Input
                      value={petColor}
                      onChange={(e) => setPetColor(e.target.value)}
                      placeholder="e.g., brown and white"
                    />
                  </div>
                  <div>
                    <Label>Found Location</Label>
                    <Input
                      value={foundLocation}
                      onChange={(e) => setFoundLocation(e.target.value)}
                      placeholder="Where did you find this pet?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            {petSource && (
              <>
                <div>
                  <Label>Adoption Type</Label>
                  <Select onValueChange={setAdoptionType} value={adoptionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Adoption Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">
                        Permanent Adoption
                      </SelectItem>
                      <SelectItem value="temporary">Temporary Care</SelectItem>
                      {/* Removed Foster Care */}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={
                    petSource === "my-pet"
                      ? "Tell potential adopters about your pet's personality, habits, and what kind of home would be perfect for them..."
                      : "Describe the pet's condition when found, any medical care provided, temperament observed, and what kind of home they need..."
                  }
                  rows={4}
                />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm text-muted-foreground hover:bg-purple-100"
                    >
                      <Image size={16} className="mr-1" /> Photo
                    </Button>
                    {/* Removed Video Button */}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 text-sm"
                      onClick={handlePostAdoption}
                      disabled={
                        !isAuthenticated || // Must be authenticated to post
                        !postText ||
                        !petSource ||
                        !adoptionType ||
                        (petSource === "my-pet" && !selectedPet) ||
                        (petSource === "found-pet" && !petSpecies)
                      }
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
