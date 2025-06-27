import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface ScheduleMeetingProps {
  receiverId: string;
}

const MeetingScheduler = ({ receiverId }: ScheduleMeetingProps) => {
  const [dateTime, setDateTime] = useState("");
  const [title, setTitle] = useState("");

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const localDate = new Date(dateTime);
      const tzOffset = localDate.getTimezoneOffset() * 60000;
      const utcDate = new Date(localDate.getTime() - tzOffset);

      const response = await axios.post(
        `${BASE_URL}/meetings/schedule`,
        {
          receiverId,
          dateTime: utcDate.toISOString(),
          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
          title,
          roomName: `guidenaHQ-${receiverId}-${Date.now()}`,
        },
        { withCredentials: true }
      );

      if (response.data) {
        toast.success("Meeting scheduled for" + dateTime);
      }
    } catch (error) {
      toast.error("Failed to schedule meeting");
      console.error("Schedule error:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>
      <form onSubmit={handleSchedule} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Meeting Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meeting title"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-medium-teal"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Date & Time (IST)
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            placeholder="Select date and time"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-medium-teal"
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            All times are in Indian Standard Time (IST)
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-medium-teal text-white py-2 rounded hover:bg-deep-teal"
        >
          Schedule Meeting
        </button>
      </form>
    </div>
  );
};

export default MeetingScheduler;
