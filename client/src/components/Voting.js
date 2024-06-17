import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Card from './Card';
import './Voting.css';
import { useLocation } from 'react-router-dom';

const socket = io.connect('http://localhost:4000');

function Voting() {
    const { id } = useParams();
    const [voters, setVoters] = useState([]);
    const fibo = [0, 1, 2, 3, 5, 8, 13, 21, 34];
    const location = useLocation();
    const { username } = location.state || {};

    useEffect(() => {
        socket.emit("join_session", { sessionid: id });

        socket.on("voters", (data) => {
            setVoters(data);
        });
    }, [id]);

    return (
        <div className="voting-container">
            <h1>Voting {id}</h1>
            <div className="card-row">
                {voters.map((voter, index) => (
                    <Card key={index} value={voter.user_name} />
                ))}
            </div>
            <div className="card-row">
                {fibo.map((fibo, index) => (
                    <Card key={index} value={fibo} />
                ))}
                <Card value={"🍵"}/>
                <Card value={"?"}/>
            </div>
        </div>
    );
}

export default Voting;
