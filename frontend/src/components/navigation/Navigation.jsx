import React from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Navigation = () => {
    const navigate = useNavigate();

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <div className="navigation" style={{ fontSize: '10px' }}>
            {/* Link to retrieve a specific user by ID */}
            <Button onClick={() => handleNavigate("/api/users/:id")} variant="contained" color="primary">
                Retrieve User by ID
            </Button>

            {/* Link to create a new user */}
            <Button onClick={() => handleNavigate("/api/users/new")} variant="contained" color="primary">
                Create New User
            </Button>
        </div>
    );
};

export default Navigation;
