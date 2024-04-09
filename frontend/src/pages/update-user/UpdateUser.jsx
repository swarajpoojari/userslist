/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';

const UpdateUser = () => {
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        domain: '',
        available: '',
        email: '',
        gender: '',
        avatar: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') {
            value = parseInt(value);
        } else if (name === 'available') {
            value = Boolean(value);
        }
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            // Send a PUT request to the backend to update the user by ID
            // const response = await axios.put(`/api/users/${userId}`, userData);
            const response = await fetch(`http://localhost:5500/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            // If the request is successful, display a success message
            // setSuccessMessage(response);
        } catch (error) {
            // If an error occurs, display the error message
            setError(error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <label>User ID:</label>
                <input
                    type="text"
                    name="id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Domain:</label>
                <input
                    type="text"
                    name="domain"
                    value={userData.domain}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Availability:</label>
                <input
                    type="text"
                    name="available"
                    value={userData.availability}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Gender:</label>
                <input
                    type="text"
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Profile Pic:</label>
                <input
                    type="text"
                    name="avatar"
                    value={userData.profile_pic}
                    onChange={handleChange}
                />
            </div>
            {error && <div>Error: {error}</div>}
            {successMessage && <div>{successMessage}</div>}
            <button onClick={handleUpdate} disabled={!userId || loading}>
                {loading ? 'Updating...' : 'Update User'}
            </button>
        </div>
    );
};

export default UpdateUser;
/* eslint-enable */
