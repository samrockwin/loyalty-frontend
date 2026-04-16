import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const navigate = useNavigate();

  // ✅ Safe user parsing
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/get_points.php?user_id=${user.id}`);

      setHistory(res.data?.history || []);
      setTotalPoints(res.data?.total_points || 0);
    } catch (err) {
      console.log("Error fetching history:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container">
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Customer History</h2>
          <h3 className="text-lg mb-4">
            Total Points: <span className="text-green-600">{totalPoints}</span> ⭐
          </h3>

          {history.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    
                    <th>Amount</th>
                    <th className="text-right">Points</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{item.type}</td>
                      <td>₹{item.cost}</td>
                      <td className="text-right text-green-600 font-bold">
                        +{item.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;