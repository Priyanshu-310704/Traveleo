import React from "react";
import Navbar from "../components/Navbar";

const TripDetails = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Trip Expenses</h2>

        <div className="flex gap-3 mb-6">
          <input className="border p-2 rounded" placeholder="Amount" />
          <select className="border p-2 rounded">
            <option>Food</option>
            <option>Transport</option>
            <option>Hotel</option>
            <option>Shopping</option>
          </select>
          <button className="bg-blue-600 text-white px-4 rounded">Add</button>
        </div>
      </div>
    </>
  );
};

export default TripDetails;
