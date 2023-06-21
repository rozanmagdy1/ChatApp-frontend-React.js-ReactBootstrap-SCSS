import React, {useEffect} from "react";
import "../style/_home.scss";
import Header from "./Header";
import {Button, Container, Table} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllUsers, fetchUserProfile} from "./slices/userSlice";
import Spinner from "./Spinner";
import UnAuthenticated from "./UnAuthenticated";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Users() {
    let dispatch = useDispatch();
    let users = useSelector((state) => state.user.users);
    let user = useSelector((state) => state.user.user);
    let token = JSON.parse(localStorage.getItem('token'));
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchUserProfile());
        document.body.style.backgroundImage = "none";
        document.body.style.display = "block";

        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.display = "";
        };
    }, []);


    async function handleChatClicked(receiver_id) {
        let res = await axios.get(`https://chat-app-backend-nu.vercel.app/conversation/find/${receiver_id}/${user._id}`,
            {headers: {"Authorization": token,}});
        if (res.data.result === 'no conversation, same user') {
        } else if (res.data.result === 'no conversation') {
            let res = await axios.post('https://chat-app-backend-nu.vercel.app/conversation',
                {
                    "senderId": user._id,
                    "receiverId": receiver_id,
                },
                {headers: {"Authorization": token,}}
                )
            if (res.data.result === "Conversation added"){
                navigate('/chat');
            }
        }else{
            navigate('/chat');
        }
    }

    if (localStorage.getItem("token") === null) {
        return <UnAuthenticated/>;
    }

    if (users?.length > 0) {
        return (
            <div className="home">
                <Header/>
                <Container>
                    <>
                        <h2 className="pt-3 pb-3 subTitle">Users</h2>
                        <Table hover responsive>
                            <thead>
                            <tr className="text-center">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Age</th>
                                <th>Chat</th>
                            </tr>
                            </thead>
                            {users?.map((user) => (
                                <tbody key={user._id}>
                                <tr>
                                    <td className="p-4 text-center">{user._id}</td>
                                    <td className="p-4 text-center">{user.name}</td>
                                    <td className="p-4 text-center">{user.username}</td>
                                    <td className="p-4 text-center">{user.age}</td>
                                    <td className="p-4">
                                        <div className="d-flex flex-row justify-content-center">
                                            <Button className="chat text-white" type="button"
                                                    onClick={() => handleChatClicked(user._id)}
                                            >
                                                Start
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            ))}
                        </Table>
                    </>
                </Container>
            </div>
        );
    }
    return <Spinner/>;
}

export default Users;
