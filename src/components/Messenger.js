import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import "../style/_messanger.scss";
import "../style/_spinner.scss";
import Conversations from "./Conversations";
import Message from "./Message";
import ChatOnline from "./ChatOnline";
import axios from "axios";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./slices/userSlice";
import Spinner from "./Spinner";
import UnAuthenticated from "./UnAuthenticated";
import {addNotification} from "./slices/notificationSlice";

function Messenger() {
  const scrollRef = useRef();
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  let token = JSON.parse(localStorage.getItem("token"));

  conversations.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  let user = useSelector((state) => state.user.user);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);


  // side effects for socket io
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      dispatch(addNotification(data));
    });
  }, []);


  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (user._id) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user]);

  // get conversations of user login know to view in chat menu
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `https://chat-app-backend-nu.vercel.app/conversation/${user._id}`,
          { headers: { Authorization: token } }
        );
        setConversations(res.data.result);
      } catch (e) {
        console.log(e);
      }
    };
    if (user) {
      getConversations().then(() => {});
    }
  }, [user._id]);

  // make useEffect to reset style of chat page
  useEffect(() => {
    document.body.style.backgroundImage = "none";
    document.body.style.display = "block";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.display = "";
    };
  }, []);

  // get message of current chat
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `https://chat-app-backend-nu.vercel.app/message/${currentChat?._id}`,
          { headers: { Authorization: token } }
        );
        setMessages(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages().then(() => {});
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios.post("https://chat-app-backend-nu.vercel.app/message", message, {
          headers: { Authorization: token },
        });
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // move the scroller to the end of current chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (localStorage.getItem("token") === null) {
    return <UnAuthenticated />;
  }
  if (localStorage.getItem("token") !== null) {
    return (
      <div>
        {/*notifications={notifications} setNotifications={setNotifications}*/}
        <Header/>
        <div className="messenger d-flex">
          <div className="chatMenu">
            <div id="chatMenuWrapper" className="chatMenuWrapper  p-5 h-100">
              <input
                placeholder="Search for people"
                className="chatMenuInput"
              />

              {conversations.length === 0 ? (
                <Spinner />
              ) : (
                conversations.map((conv) => (
                  <div key={conv._id} onClick={() => setCurrentChat(conv)}>
                    <Conversations conversation={conv} currentUser={user} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chatBox">
            <div id="chatBoxWrapper" className="chatBoxWrapper p-5 h-100">
              {currentChat ? (
                <>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div ref={scrollRef} key={m._id}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                  </div>

                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open conversation to start a chat
                </span>
              )}
            </div>
          </div>

          <div className="chatOnline">
            <div className="chatOnlineWrapper p-5 h-100">
              <h5 className='p-4 text-black-50'> Users Online</h5>
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user._id}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messenger;
