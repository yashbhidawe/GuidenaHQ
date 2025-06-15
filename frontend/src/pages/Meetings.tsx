import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

interface Meeting {
  _id: string;
  title: string;
  dateTime: string;
  hostId: string;
  receiverId: string;
  roomName: string;
  timezone: string;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/meetings`, {
        withCredentials: true,
      });
      setMeetings(response.data);
    } catch (error) {
      toast.error("Failed to fetch meetings");
      console.error("Fetch meetings error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinMeeting = (roomName: string) => {
    navigate(`/meet/${roomName}`);
  };

  const cancelMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;

    try {
      await axios.delete(`${BASE_URL}/meetings/${meetingId}`, {
        withCredentials: true,
      });
      toast.success("Meeting cancelled successfully");
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to cancel meeting");
      console.error("Cancel meeting error:", error);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Meetings</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg">{meeting.title}</h3>
              <p className="text-gray-600">
                {format(new Date(meeting.dateTime), "PPp")}
              </p>
              <button
                onClick={() => joinMeeting(meeting.roomName)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Join Meeting
              </button>

              <button
                onClick={() => cancelMeeting(meeting._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
