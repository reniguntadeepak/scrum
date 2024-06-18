import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

const JoinSession = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ sessionid: '', username: '' });

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
            const sessionIdFromResponse = response.url.split('/').pop();
            navigate(`/voting/${sessionIdFromResponse}`, { state: { username: formData.username } });
            socket.emit("join_session", { sessionid: sessionIdFromResponse, username: formData.username });
        } else {
            console.error('Failed to join the session.');
        }
    };

    return (
        <form onSubmit={submitForm}>
            <label htmlFor='sessionid'>Session Id</label>
            <input type='text' name='sessionid' value={formData.sessionid} onChange={handleChange} />
            <label htmlFor='username'>Your name</label>
            <input type='text' name='username' value={formData.username} onChange={handleChange} />
            <button type='submit'>Join Session</button>
        </form>
    );
};

export default JoinSession;
