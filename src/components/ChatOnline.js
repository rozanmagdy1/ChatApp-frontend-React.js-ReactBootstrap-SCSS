import React, {useEffect, useState} from 'react';
import '../style/_chatOnline.scss';
import {useDispatch} from "react-redux";
import {fetchAllUsers} from "./slices/userSlice";

function ChatOnline({ onlineUsers,currentId}) {
    let [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    let new_online_users = onlineUsers.filter((u)=> u.userId !== currentId);

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAllUsers()).then((result) => {
            setFriends(result.payload);
        });
    }, []);

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => {
            return new_online_users.find((u) => u.userId === f._id);
        }));
    }, [friends, onlineUsers]);

    return (
        <div className='chatOnline'>
            {onlineFriends.map((o) => (
                <div className='chatOnlineFriend' key={o._id}>
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src="https://i.pinimg.com/originals/52/b2/aa/52b2aaf2ac84b40b384dddb36efbb65a.jpg"
                            alt=""
                        />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{o?.name}</span>
                </div>

            ))
            }

        </div>
    );
}

export default ChatOnline;