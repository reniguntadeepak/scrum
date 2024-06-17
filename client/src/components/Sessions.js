import { useState } from "react"

function Sessions() {
    const [formData, setFormData] = useState({ sessionname: '', username: '', series: 'fibonacci' });
    const [error,setError] = useState("no");
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
            window.location.href = response.url;
        } else {
            setError("yes");
        }
    };

    return (
        <form onSubmit={submitForm}>
            <label for='sessionname'>Sessions Name</label>
            <input type="text" name='sessionname' value={formData.sessionname} onChange={handleChange}></input>
            <label for='username'>Your name</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange}></input>
            <div>
                <label>
                    <input type="radio" name="series" value="fibonacci" onChange={handleChange} checked={formData.series === 'fibonacci'} />
                    Fibonacci series
                </label>
                <label>
                    <input type="radio" name="series" value="custom" onChange={handleChange} checked={formData.series === 'custom'} />
                    Custom
                </label>
            </div>
            <button type="submit">Create Session</button>
        </form>
    )
}
export default Sessions;