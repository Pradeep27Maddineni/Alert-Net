import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import img6 from "../assets/img6.png";
import img7 from "../assets/img7.png";

const ChatPage = () => {
  const { incidentId, receiverId } = useParams();

  return (
    <div className="relative min-h-[93vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6 overflow-hidden">

      {/* Top-left image */}
      <img
        src={img6}
        alt="Person sending message"
        className="hidden md:block absolute top-4 left-4  opacity-70 animate-float pointer-events-none"
      />

      {/* Bottom-right image */}
      <img
        src={img7}
        alt="Person receiving message"
        className="hidden md:block absolute bottom-8 right-4  opacity-80 animate-float-reverse pointer-events-none"
      />

      <ChatBox incidentId={incidentId} receiverId={receiverId} />
    </div>
  );
};

export default ChatPage;
