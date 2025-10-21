import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const GlobalMessageListener = () => {
    const { socket } = useContext(SocketContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!socket || !user) return;

        const handleReceive = (msg) => {
            if ((msg.receiver?._id || msg.receiver) === user._id) {
                toast.info(`💬 New message arrived`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.off("receiveMessage", handleReceive);
        };
    }, [socket, user]);

    return null;
};

export default GlobalMessageListener;
