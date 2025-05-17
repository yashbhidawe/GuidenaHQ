import { useParams } from "react-router-dom";

const Chat = () => {
  const { mentorshipId } = useParams();
  return <div>{mentorshipId}</div>;
};

export default Chat;
