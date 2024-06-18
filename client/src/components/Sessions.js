import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

const Sessions = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ sessionname: '', username: '', series: 'fibonacci' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const response = await fetch('/session', {
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
            console.error('Failed to create the session.');
        }
    };

    return (
        <form onSubmit={submitForm}>
            <label htmlFor='sessionname'>Session Name</label>
            <input type='text' name='sessionname' value={formData.sessionname} onChange={handleChange} />
            <label htmlFor='username'>Your name</label>
            <input type='text' name='username' value={formData.username} onChange={handleChange} />
            <button type='submit'>Create Session</button>
        </form>
    );
};

export default Sessions;
