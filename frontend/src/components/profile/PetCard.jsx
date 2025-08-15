import { Dog, Cat, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PetCard = ({ pet, setSelectedPet, onCardClick }) => {
  // Function to get the image URL
  const getImageUrl = () => {
    if (pet.profilePhoto) {
      const photoPath = pet.profilePhoto;
      if (photoPath.startsWith("/uploads")) {
        return `http://localhost:3000${photoPath}`;
      }
      return `http://localhost:3000/uploads/photos/${pet._id}/${photoPath}`;
    }

    // Fallback image
    return "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={onCardClick}
    >
      <div className="relative">
        <img
          src={getImageUrl()}
          alt={pet.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.log(
              "Image failed to load:",
              e.target.src,
              "for pet:",
              pet.name
            );
            // Try alternative URL format in case the file is actually in a subdirectory
            if (!e.target.src.includes("/pets/")) {
              const altUrl = `http://localhost:3000/uploads/photos/${
                pet._id
              }/${pet.photos[0]?.split("/").pop()}`;
              console.log("Trying alternative URL:", altUrl);
              e.target.src = altUrl;
            } else {
              e.target.src =
                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop";
            }
          }}
          onLoad={(e) => {
            console.log("Image loaded successfully for", pet.name);
          }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              pet.status === "Available"
                ? "bg-green-100 text-green-800"
                : pet.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {pet.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {pet.type === "Dog" ? (
            <Dog className="w-5 h-5 text-blue-500" />
          ) : (
            <Cat className="w-5 h-5 text-purple-500" />
          )}
          <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
        </div>
        <p className="text-gray-600 mb-2">
          {pet.breed} • {pet.age} • {pet.gender}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {pet.description?.slice(0, 80) || "No description"}...
        </p>
        <div className="flex gap-2 mb-4">
          {pet.traits?.slice(0, 2).map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedPet?.({ ...pet })}
            className="w-full flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </Button>
          <Link to={`/pet/${pet._id || pet.id}`} className="w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
