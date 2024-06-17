import './Card.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function Card({value}){
    const handleClick = () => {
        socket.emit("vote",{number:value});
    }
    return (
        <div className="card" onClick={handleClick}>
            <h2 id='name'>{value}</h2>
        </div>
    );
}
export default Card;