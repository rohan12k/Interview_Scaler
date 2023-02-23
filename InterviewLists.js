import React, { useState, useEffect } from "react";
import axios from "axios";

const InterviewsList = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get("/api/interviews");
        setInterviews(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div>
      <h1>Upcoming Interviews</h1>
      <table>
        <thead>
          <tr>
            <th>Participants</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <tr key={interview.id}>
              <td>{interview.participants.join(", ")}</td>
              <td>{new Date(interview.startTime).toLocaleString()}</td>
              <td>{new Date(interview.endTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewsList;
