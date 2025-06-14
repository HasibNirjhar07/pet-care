import { Dog, Cat, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PetCard = ({ pet, setSelectedPet }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden">
    <div className="relative">
      <img src={pet.images[0]} alt={pet.name} className="w-full h-48 object-cover" />
      <div className="absolute top-3 right-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            pet.status === 'Available'
              ? 'bg-green-100 text-green-800'
              : pet.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {pet.status}
        </span>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        {pet.type === 'Dog' ? (
          <Dog className="w-5 h-5 text-blue-500" />
        ) : (
          <Cat className="w-5 h-5 text-purple-500" />
        )}
        <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
      </div>
      <p className="text-gray-600 mb-2">
        {pet.breed} • {pet.age} • {pet.gender}
      </p>
      <p className="text-sm text-gray-500 mb-4">{pet.description.slice(0, 80)}...</p>
      <div className="flex gap-2 mb-4">
        {pet.traits.slice(0, 2).map((trait, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {trait}
          </span>
        ))}
      </div>
      <Button
        onClick={() => setSelectedPet({ ...pet })}
        className="w-full flex items-center justify-center gap-2"
      >
        <Edit className="w-4 h-4" />
        Edit Details
      </Button>
    </div>
  </div>
);

export default PetCard;