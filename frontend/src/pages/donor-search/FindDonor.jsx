import { useState } from "react";
import api from "../../services/api";

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const params = {};

      if (bloodGroup) {
        params.bloodGroup = bloodGroup;
      }

      if (city.trim()) {
        params.city = city.trim();
      }

      if (availability) {
        params.availability = availability;
      }

      const response = await api.get("/donors/search", {
        params,
      });

      setDonors(response.data.donors || []);
    } catch (error) {
      console.error("Donor search error:", error);

      setDonors([]);
      setError(
        error.response?.data?.message ||
          "Unable to search donors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBloodGroup("");
    setCity("");
    setAvailability("");
    setDonors([]);
    setError("");
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold tracking-wide text-red-600">
            DONOR SEARCH
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Find a Blood Donor
          </h1>

          <p className="mt-2 text-gray-500">
            Find verified donors based on blood group, city and availability.
          </p>
        </div>

        {/* Search Filters */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

              {/* Blood Group */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Blood Group
                </label>

                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500"
                >
                  <option value="">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Availability
                </label>

                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500"
                >
                  <option value="">Any Availability</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  {loading ? "Searching..." : "Search"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search Results */}
        {searched && !loading && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Donor Results
              </h2>

              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                {donors.length} donor{donors.length !== 1 ? "s" : ""}
              </span>
            </div>

            {donors.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🩸
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  No matching donors found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your blood group, city or availability filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {donors.map((donor) => (
                  <div
                    key={donor._id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Donor Header */}
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donor.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {donor.city}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Blood Group
                        </span>

                        <span className="font-semibold text-gray-900">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Availability
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            donor.isAvailable
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {donor.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Verification
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searched && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
              🩸
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Search for verified donors
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select your requirements above to find matching donors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindDonor;