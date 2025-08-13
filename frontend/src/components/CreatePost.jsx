import { useState } from "react";
import { Camera, Image, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = ({ 
  userName = 'John Doe',
  userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  isAuthenticated = true,
  myPets = [
    { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever' },
    { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian' },
    { id: 3, name: 'Charlie', species: 'Bird', breed: 'Parrot' }
  ]
}) => {
  const [postText, setPostText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [petSource, setPetSource] = useState(""); // "my-pet" or "found-pet"
  const [selectedPet, setSelectedPet] = useState("");
  const [adoptionType, setAdoptionType] = useState("");
  
  // Found pet fields
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petColor, setPetColor] = useState("");
  const [foundLocation, setFoundLocation] = useState("");

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
    setShowForm(false);
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
              onClick={() => setShowForm(true)}
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
              <Label className="text-sm font-medium">What type of pet are you posting about?</Label>
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
                  <Select onValueChange={setSelectedPet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from your pets" />
                    </SelectTrigger>
                    <SelectContent>
                      {myPets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id.toString()}>
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
                    <Select onValueChange={setPetSpecies}>
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
                  <Select onValueChange={setAdoptionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Adoption Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent Adoption</SelectItem>
                      <SelectItem value="temporary">Temporary Care</SelectItem>
                      <SelectItem value="foster">Foster Care</SelectItem>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm text-muted-foreground hover:bg-purple-100"
                    >
                      <Camera size={16} className="mr-1" /> Video
                    </Button>
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
                      disabled={!petSource || !adoptionType || (!selectedPet && petSource === "my-pet") || (!petSpecies && petSource === "found-pet")}
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