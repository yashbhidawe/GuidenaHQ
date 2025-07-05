import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";
import { Calendar, Users, Video, Trash2 } from "lucide-react";

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
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-deep-teal mb-2">
            Your Meetings
          </h1>
          <p className="text-medium-teal text-lg">
            Manage your scheduled meetings and sessions
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {meetings.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-24 h-24 text-light-teal mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-deep-teal mb-2">
                  No meetings scheduled
                </h3>
                <p className="text-medium-teal">
                  Your upcoming meetings will appear here
                </p>
              </div>
            ) : (
              meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-deep-teal"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-deep-teal mb-2">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-medium-teal">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {format(new Date(meeting.dateTime), "PPp")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-light-teal rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-light-teal flex-col md:flex-row space-y-4 md:space-y-0 ">
                      <div className="flex items-center space-x-2 text-medium-teal">
                        <div className="w-2 h-2 bg-light-teal rounded-full"></div>
                        <span className="text-sm">
                          Room: {meeting.roomName}
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => joinMeeting(meeting.roomName)}
                          className="flex items-center space-x-2 bg-light-teal text-white px-4 py-2 rounded-lg hover:bg-medium-teal transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          <Video className="w-4 h-4" />
                          <span className="font-medium">Join Meeting</span>
                        </button>
                        <button
                          onClick={() => cancelMeeting(meeting._id)}
                          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="font-medium">Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
