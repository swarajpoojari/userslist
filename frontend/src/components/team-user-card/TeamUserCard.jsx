import React from 'react';
import './style.css'

const TeamUserCard = ({ user, onRemove }) => {
    return (
        <div className="selected-user">
            <img src={user.avatar} alt={user.name} className="avatar" />
            <span className="user-name">{user.first_name} {user.last_name}</span>
            <button onClick={() => onRemove(user.id)}>Remove</button>
        </div>
    );
};

export default TeamUserCard;
