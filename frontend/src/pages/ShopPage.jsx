import React from "react";

const products = [
  {
    name: "Premium Dog Food",
    description: "Nutritious and delicious food for all breeds.",
    price: "$25",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cat Scratching Post",
    description: "Durable and fun for your feline friends.",
    price: "$18",
    image: "https://images.unsplash.com/photo-1518715308788-300e1e1e2dba?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Pet Shampoo",
    description: "Gentle shampoo for a shiny, healthy coat.",
    price: "$12",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bird Cage",
    description: "Spacious and safe for small birds.",
    price: "$40",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
];

const ShopPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-10">
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Pet Shop
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Browse our selection of quality products for your pets.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg mb-4" />
            <h2 className="text-lg font-semibold text-purple-600 mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2 text-center">{product.description}</p>
            <span className="text-pink-600 font-bold mb-4">{product.price}</span>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:scale-105 transition-all">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ShopPage;