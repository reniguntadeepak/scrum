import { useState } from "react";
import io from 'socket.io-client';
import { Navigate } from "react-router-dom";

const socket = io.connect('http://localhost:4000');

function JoinSession(){
    const [formData, setFormData] = useState({ sessionid: '', username: '' });
    const [error,setError] = useState("no");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const response = await fetch('/joinsession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.redirected) {
            socket.emit("join_session", { sessionid: formData.sessionid });
            window.location.href = response.url;
        } else {
            setError("yes");
        }
    };
    return (
        <form onSubmit={submitForm}>
            <label for='sessionid'>Sessions Id</label>
            <input type="text" name='sessionid' value={formData.sessionid} onChange={handleChange}></input>
            <label for='username'>Your name</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange}></input>
            <button type="submit">Create Session</button>
        </form>
    )
}
export default JoinSession;