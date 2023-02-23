import React, { useState, useEffect } from "react";
import axios from "axios";

const InterviewCreation = () => {
  const [participants, setParticipants] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { participants, startTime, endTime };
    try {
      const response = await axios.post("/api/interviews", data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      const response = await axios.get("/api/participants");
      setParticipants(response.data);
    };
    fetchParticipants();
  }, []);

  return (
    <div>
      <h1>Create an Interview</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Participants:
          <select
            multiple
            value={participants}
            onChange={(event) => setParticipants(event.target.value)}
          >
            {/* Display the list of participants */}
          </select>
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Interview</button>
      </form>
    </div>
  );
};

export default InterviewCreation;
