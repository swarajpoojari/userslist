import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardHeader, Avatar, CardContent, Typography } from '@mui/material';

const TeamDetails = ({ team }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const promises = team.userIds.map(userId =>
                    axios.get(`/api/users/${userId}`)
                );

                const responses = await Promise.all(promises);
                const usersData = responses.map(response => response.data);
                setUsers(usersData);
                console.log(usersData)
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [team]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Team Details</Typography>
            <Typography variant="h6" gutterBottom>Team name: {team.name}</Typography>
            <Grid container spacing={3}>
                {users.map(user => (
                    <Grid item xs={12} sm={6} md={4} lg={12} key={user._id}>
                        <Card>
                            <CardHeader
                                avatar={<Avatar src={user.avatar} alt={user.first_name} width="100" />}
                                title={`${user.first_name} ${user.last_name}`}
                                subheader={`Email: ${user.email}`}
                            />
                            <CardContent>
                                <Typography variant="body1" component="p">Gender: {user.gender}</Typography>
                                <Typography variant="body1" component="p">Domain: {user.domain}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TeamDetails;
