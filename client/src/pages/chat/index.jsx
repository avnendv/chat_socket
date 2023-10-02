import RoomAndUsersColumn from "./room-and-users";
import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import styles from "./styles.module.css";

const Chat = ({ username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
