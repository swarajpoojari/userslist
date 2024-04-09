import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = () => {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleDelete = async () => {
        try {
            setLoading(true);
            // Send a DELETE request to the backend to delete the user by ID
            const response = await axios.delete(`/api/users/${userId}`);
            // If the request is successful, display a success message
            setSuccessMessage(response.data.message);
        } catch (error) {
            // If an error occurs, display the error message
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserId(e.target.value);
    };

    return (
        <div>
            <div>
                <label>Enter User ID:</label>
                <input
                    type="text"
                    value={userId}
                    onChange={handleChange}
                />
            </div>
            {error && <div>Error: {error}</div>}
            {successMessage && <div>{successMessage}</div>}
            <button onClick={handleDelete} disabled={!userId || loading}>
                {loading ? 'Deleting...' : 'Delete User'}
            </button>
        </div>
    );
};

export default DeleteUser;
