import React, { useState } from "react";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState("Birthday");
  const [relationship, setRelationship] = useState("Friend");
  const [interests, setInterests] = useState("");
  const [age, setAge] = useState("");
  const [budget, setBudget] = useState("Under $25");
  const [giftSuggestions, setGiftSuggestions] = useState([]);
  const [error, setError] = useState(""); // State for error message

  const getGiftSuggestions = async () => {
    // Check if essential fields are filled
    if (!age || !interests) {
      setError("Please fill in all the fields.");
      return; // Stop function if required fields are missing
    }

    const requestData = {
      occasion,
      relationship,
      interests,
      age,
      budget,
    };

    setError(""); // Clear any previous error
    setLoading(true);

    try {
      // Make the API request to the backend
      const response = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions.");
      }

      const data = await response.json();

      // Check if the response contains the expected data structure
      if (!Array.isArray(data) || data.length === 0) {
        setError("No suggestions available.");
      } else {
        setGiftSuggestions(data); // Update the state to show results
      }
    } catch (error) {
      setError("Error fetching suggestions. Please try again.");
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-500 text-white flex flex-col items-center px-4 py-10 font-sora">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-purple-900">GiftPredict:</span> Discover the
          Perfect Present Every Time
        </h1>
        <p className="text-lg text-gray-800">
          GiftPredict provides personalized gift recommendations tailored to the
          recipient's preferences, ensuring you find the ideal present for any
          occasion.
        </p>
      </div>

      <div className="bg-[#13143A] mt-10 w-full max-w-3xl rounded-xl p-6 shadow-lg space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Occasion</label>
          <select
            className="w-full p-3 rounded-md bg-[#2D2E56] text-white focus:outline-none"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Graduation</option>
            <option>Holiday</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Relationship</label>
          <select
            className="w-full p-3 rounded-md bg-[#2D2E56] text-white focus:outline-none"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          >
            <option>Friend</option>
            <option>Partner</option>
            <option>Parent</option>
            <option>Sibling</option>
            <option>Colleague</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Interests</label>
          <input
            type="text"
            placeholder="Enter or select interests"
            className="w-full p-3 rounded-md bg-[#2D2E56] text-white focus:outline-none"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Age</label>
          <input
            type="number"
            placeholder="e.g. 25"
            className="w-full p-3 rounded-md bg-[#2D2E56] text-white focus:outline-none"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Budget</label>
          <select
            className="w-full p-3 rounded-md bg-[#2D2E56] text-white focus:outline-none"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option>Under $25</option>
            <option>$25 - $50</option>
            <option>$50 - $100</option>
            <option>Above $100</option>
          </select>
        </div>

        <button
          disabled={loading}
          onClick={getGiftSuggestions}
          className={`mt-4 w-full p-3 rounded-md font-bold transition ${
            loading
              ? "bg-[#2D2E56] text-gray-400 cursor-not-allowed"
              : "bg-violet-500 hover:bg-purple-500 text-white"
          }`}
        >
          {loading ? "Loading..." : "Get Gift Suggestions"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>} {/* Display error message */}

        {giftSuggestions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Gift Suggestions:</h2>
            {giftSuggestions.map((gift, index) => (
              <div key={index} className="bg-purple-500 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold">{gift.name}</h3>
                <p className="text-gray-300">{gift.description}</p>
                <a
                  href={gift.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-800 hover:underline mt-2 inline-block"
                >
                  View Product
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
