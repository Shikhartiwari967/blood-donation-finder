import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function DonorManagement() {
  const { token } = useAuth();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [isAvailable, setIsAvailable] = useState("");

  const fetchDonors = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.bloodGroup) {
        params.bloodGroup = filters.bloodGroup;
      }

      if (filters.city) {
        params.city = filters.city;
      }

      if (filters.isVerified !== "") {
        params.isVerified = filters.isVerified;
      }

      if (filters.isAvailable !== "") {
        params.isAvailable = filters.isAvailable;
      }

      const response = await api.get("/admin/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setDonors(response.data.donors);
    } catch (error) {
      console.error("Failed to fetch donors:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load donors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDonors();
    }
  }, [token]);

  const handleApplyFilters = () => {
    fetchDonors({
      bloodGroup,
      city,
      isVerified,
      isAvailable,
    });
  };

  const handleClearFilters = () => {
    setBloodGroup("");
    setCity("");
    setIsVerified("");
    setIsAvailable("");

    fetchDonors();
  };

  const handleVerification = async (userId, verified) => {
    try {
      await api.patch(
        `/admin/donors/${userId}/verification`,
        {
          isVerified: verified,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDonors({
        bloodGroup,
        city,
        isVerified,
        isAvailable,
      });
    } catch (error) {
      console.error("Verification update failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update verification"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">Loading donors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Donor Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage donor verification, availability and search
          registered donors.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Donors
        </p>

        <p className="text-3xl font-bold text-gray-900 mt-1">
          {donors.length}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Filter Donors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>

            <input
              type="text"
              value={city}
              placeholder="Enter city"
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification
            </label>

            <select
              value={isVerified}
              onChange={(e) => setIsVerified(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>

            <select
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            Apply Filters
          </button>

          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Donor table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {donors.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">
              No donors found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Blood Group
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    City
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Verified
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Available
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {donors.map((donor) => (
                  <tr
                    key={donor._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {donor.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {donor.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center min-w-12 px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
                        {donor.bloodGroup}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {donor.phone}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {donor.city}
                    </td>

                    <td className="px-5 py-4">
                      {donor.isVerified ? (
                        <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                          Not Verified
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {donor.isAvailable ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          handleVerification(
                            donor._id,
                            !donor.isVerified
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          donor.isVerified
                            ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {donor.isVerified
                          ? "Unverify"
                          : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorManagement;