import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PetFormFields = ({ petData, setPetData, addTrait, removeTrait }) => {
  const handleAddTrait = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      addTrait(e.target.value.trim());
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
          <Input
            value={petData.name}
            onChange={(e) => setPetData({ ...petData, name: e.target.value })}
            placeholder="Enter pet name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Select value={petData.type} onValueChange={(value) => setPetData({ ...petData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dog">Dog</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <Input
            value={petData.breed}
            onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
            placeholder="Enter breed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <Input
            value={petData.age}
            onChange={(e) => setPetData({ ...petData, age: e.target.value })}
            placeholder="e.g., 2 years"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <Select value={petData.gender} onValueChange={(value) => setPetData({ ...petData, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <Input
            value={petData.weight}
            onChange={(e) => setPetData({ ...petData, weight: e.target.value })}
            placeholder="e.g., 25 lbs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select value={petData.status} onValueChange={(value) => setPetData({ ...petData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Adopted">Adopted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adoption Type</label>
          <Select
            value={petData.adoptionType}
            onValueChange={(value) => setPetData({ ...petData, adoptionType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select adoption type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Textarea
          value={petData.description}
          onChange={(e) => setPetData({ ...petData, description: e.target.value })}
          rows={3}
          placeholder="Describe your pet's personality and characteristics"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
        <Textarea
          value={petData.medicalHistory}
          onChange={(e) => setPetData({ ...petData, medicalHistory: e.target.value })}
          rows={2}
          placeholder="Vaccination status, health conditions, etc."
        />
      </div>
      {addTrait && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Pet Traits</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {petData.traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
              >
                {trait}
                <button onClick={() => removeTrait(trait)} className="text-blue-600 hover:text-blue-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a trait (e.g., Friendly, Energetic)"
              onKeyPress={handleAddTrait}
            />
            <Button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  addTrait(input.value.trim());
                  input.value = '';
                }
              }}
            >
              Add Trait
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetFormFields;