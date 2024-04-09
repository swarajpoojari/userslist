/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const GetUser = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Please enter a user ID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch user data by ID from the backend
            // const response = await fetch(`/api/users/${userId}`);
            const response = await fetch(`http://localhost:5500/api/users/${userId}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to fetch user data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Get User Details</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button type="submit">Get User</button>
            </form>

            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {user && (
                <div>
                    <h2>User Details</h2>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.first_name} {user.last_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Gender: {user.gender}</p>
                    <p>Domain: {user.domain}</p>
                    <p>Availability: {user.available}</p>
                    {/* Render additional user details */}
                </div>
            )}
        </div>
    );
};

export default GetUser;
/* eslint-enable */
