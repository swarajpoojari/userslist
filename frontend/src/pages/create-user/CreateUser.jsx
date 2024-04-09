/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        domain: '',
        gender: '',
        available: '',
        avatar: '',
    });

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'id') {
            value = parseInt(value);
        } else if (e.target.name === 'available') {
            value = Boolean(value);
        }
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        console.log(formData)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the backend to create a new user
            // const response = await axios.post('/api/users', formData);
            const response = await fetch('http://localhost:5500/api/users', {
                method: "POST", body: JSON.stringify(formData), headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(function (response) {
                return response.json()
            })
                .then(data => {
                    // setTeamDetails(data);
                    console.log(data)
                });

            // If the request is successful, log the response and resetting the form data
            console.log('User created:', response.data);
            setFormData({
                id: '',
                first_name: '',
                last_name: '',
                email: '',
                domain: '',
                gender: '',
                available: '',
                avatar: '',
            });
        } catch (error) {
            // If an error occurs, log the error
            console.error('Error creating user:', error);
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" name="id" value={formData.id} onChange={handleChange} />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                <div>
                    <label>Domain:</label>
                    <input type="text" name="domain" value={formData.domain} onChange={handleChange} />
                </div>
                <div>
                    <label>Availability:</label>
                    <input type="text" name="available" value={formData.available} onChange={handleChange} placeholder='true or false' />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Gender:</label>
                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
                </div>
                <div>
                    <label>Profile Pic:</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} placeholder='Image URL' />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateUser;
/* eslint-enable */


