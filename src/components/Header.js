import React, {useState} from 'react';
import '../style/_header.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightToBracket, faMessage, faBell} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {Row, Col, Container} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {clearNotifications} from "./slices/notificationSlice";

function Header() {
    const [open, setOpen] = useState(false);
    const notifications = useSelector((state) => state.notification);
    let navigate = useNavigate();
    let dispatch = useDispatch();


    function handleLogout() {
        navigate('/')
        localStorage.clear();
    }

    const handleRead = () => {
        dispatch(clearNotifications());
        setOpen(false);
    };

    return (
        <div className='header'>
            <Container>
                <Row className='p-3'>
                    <Col lg md sm={2}>
                        <div className='d-flex flex-row justify-content-center align-items-center'>
                            <div className='text-white d-flex flex-row'>
                                <Link to='/chat' className='text-white text-decoration-none room'>Chat Rooms</Link>
                                <FontAwesomeIcon icon={faMessage} className="text-light mx-2 pt-3"/>
                            </div>
                        </div>
                    </Col>
                    <Col lg sm={8} md={6}>
                        <div className='d-flex flex-row justify-content-center align-items-center'>
                            <div className='text-white'>
                                <h2 onClick={() => navigate('/home')}>Chat App</h2>
                            </div>
                        </div>
                    </Col>
                    <Col lg md sm={2}>
                        <div className='d-flex flex-row justify-content-center align-items-center'>
                            <div className='text-white d-flex flex-row'>
                                <button className='logout text-white'
                                        onClick={handleLogout}
                                >Logout
                                </button>
                                <FontAwesomeIcon icon={faArrowRightToBracket} className="text-light mx-1 pt-3"/>
                            </div>
                        </div>
                    </Col>
                    <Col lg={1} sm={1} md={1}>
                        <FontAwesomeIcon icon={faBell} className="text-light mx-1 pt-3"
                                         onClick={() => setOpen(!open)}
                        />
                        {
                            notifications?.length > 0 &&
                            <div className="counter">{notifications.length}</div>
                        }

                    </Col>
                </Row>

                {
                    open && (
                        <div className="notifications">
                            {
                                notifications.length > 0 ? (
                                    notifications.map((n) =>
                                        <span>className="notification">{`${n.senderId} send you message`}</span>
                                    )
                                ) : (
                                    <p>No new notifications.</p>
                                )
                            }
                            <button className="nButton" onClick={handleRead}>
                                Mark as read
                            </button>
                        </div>
                    )
                }
            </Container>

        </div>
    );
}

export default Header;