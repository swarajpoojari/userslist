/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../../components/user-card/UserCard';
import TeamDetails from '../../components/team/TeamDetail'; // Import the new component
import Navigation from '../../components/navigation/Navigation';
import TeamUserCard from '../../components/team-user-card/TeamUserCard';
import Pagination from '../../components/pagination/Pagination';
import PageCount from '../../components/page-count/PageCount';
import { Container, Grid, TextField, Button, Typography } from '@mui/material'; // Import Material-UI components
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import Material-UI components
import './style.css';

const UsersList = () => {
    const [totalUsers, setTotalUsers] = useState([]);
    const [singlePageUsers, setSinglePageUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        domain1: [],
        gender: [],
        availability: []
    });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [teamDetails, setTeamDetails] = useState(null); // State to store team details
    const [teamName, setTeamName] = useState('');
    const [teamId, setTeamId] = useState('');

    const usersPerPage = 20;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const totalUsers = await axios.get('http://localhost:5500/api/totalUsers');
                const singlePageUsers = await axios.get(`http://localhost:5500/api/users?page=${currentPage}&limit=${usersPerPage}`);
                setTotalUsers(totalUsers.data);
                setSinglePageUsers(singlePageUsers.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentPage]); // Fetch users when currentPage changes

    // console.log(singlePageUsers)

    // Filter users based on search query and selected filters
    const filteredUsers = totalUsers?.filter(totalUser =>
        totalUser?.first_name?.toLowerCase().includes(searchQuery?.toLowerCase()) &&
        (selectedFilters.domain1?.length === 0 || selectedFilters.domain1.includes(totalUser.domain)) &&
        (selectedFilters.gender?.length === 0 || selectedFilters.gender.includes(totalUser.gender)) &&
        (selectedFilters.availability?.length === 0 || selectedFilters.availability.includes(Boolean(totalUser.available)))
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Calculate indexes for displaying users based on currentPage
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

    // Handling pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // Handle search input change
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    // Handle filter selection
    const handleFilterChange = (filterType, selectedValues) => {
        setSelectedFilters({ ...selectedFilters, [filterType]: selectedValues });
        setCurrentPage(1); // Reset to first page when filter selection changes
    };

    // Handle user selection for team creation
    const handleUserSelect = (user) => {
        // Check if the user's domain is unique among selected users and available
        if (
            !selectedUsers.some(selectedUser => selectedUser.domain === user.domain) &&
            // !selectedUsers.some(selectedUser => selectedUser.available === user.available)
            (user.available === 'true')
        ) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };
    // console.log(selectedUsers)

    // Handle removing a user from the team
    const handleUserRemove = (userId) => {
        setSelectedUsers(selectedUsers?.filter(user => user.id !== userId));
    };

    // Handle creating the team
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            // Check if team name is provided
            if (!teamName) {
                alert('Please enter a team name.');
                return;
            }

            // Extract userIds from selectedUsers
            const userIds = selectedUsers?.map(user => user.id);

            const sentJSON = { name: teamName, id: parseInt(teamId), userIds: Array.isArray(userIds) ? userIds : [userIds] }

            // Send a POST request to the backend to create the team
            // const response = await axios.post('http://localhost:5500/api/team', JSON.stringify(sentJSON));
            const response = await fetch('http://localhost:5500/api/team', {
                method: "POST", body: JSON.stringify(sentJSON), headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(function (response) {
                return response.json()
            })
                .then(data => {
                    setTeamDetails(data);
                    console.log(data)
                    console.log(teamDetails)
                });

            // Reset selected users and team name after team creation
            setSelectedUsers([]);
            // Set team details after team creation
            setTeamName('');

            console.log('Team created successfully:', response.data);
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" gutterBottom>Users List</Typography>
            {/* Search input and Filters */}
            <div className="filters-container">
                <TextField
                    id='search'
                    variant="outlined"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <Filters
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <Navigation />
            {/* User Cards and Selected Users */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <div className="user-cards">
                        {currentUsers?.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onSelect={() => handleUserSelect(user)}
                                selected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                            />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <div className="selected-users">
                        <Typography variant="h2" gutterBottom>Selected Users</Typography>
                        {selectedUsers?.map(user => (
                            <TeamUserCard
                                key={user.id}
                                user={user}
                                onRemove={handleUserRemove}
                            />
                        ))}
                        {selectedUsers?.length > 0 && (
                            <form onSubmit={handleCreateTeam}>
                                <TextField
                                    variant="outlined"
                                    label="Enter team name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    label="Enter team ID"
                                    value={teamId}
                                    onChange={(e) => setTeamId(e.target.value)}
                                />
                                <Button variant="contained" type="submit">Create Team</Button>
                            </form>
                        )}
                        {teamDetails && <TeamDetails team={teamDetails} />}
                    </div>
                </Grid>
            </Grid>
            {/* Pagination and Team Details */}
            <div className="footer">
                <Pagination
                    totalUsersLength={filteredUsers.length}
                    usersPerPage={usersPerPage}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>
            {/* Total pages count after filter */}
            <PageCount users={filteredUsers} usersPerPage={usersPerPage} />
        </Container>
    );
};

const Filters = ({ selectedFilters, onFilterChange }) => {
    const [domain, setDomain] = useState([]);
    const [gender, setGender] = useState([]);
    const [availability, setAvailability] = useState([]);

    const handleFilterSelection = (event, filterType) => {
        // Access the selected value directly from the event
        const selectedValues = event.target.value;
        if (selectedValues === 'true') {
            // return true;
            onFilterChange(filterType, true)
        } else if (selectedValues === 'false') {
            // return false;
            onFilterChange(filterType, false)
        } else {
            // return selectedValues;
            onFilterChange(filterType, selectedValues)
        }
        console.log(selectedValues);
    };
    console.log(selectedFilters)

    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const domain = await axios.get('http://localhost:5500/api/users/domain')
                const gender = await axios.get('http://localhost:5500/api/users/gender')
                const availability = await axios.get('http://localhost:5500/api/users/availability')
                setDomain(domain.data)
                setGender(gender.data)
                setAvailability(availability.data)
            } catch (error) {
                console.error('Error fetching domain:', error);
            }
        };

        fetchDomain();
    }, [])

    return (
        <div className="filters">
            <FormControl variant="outlined" style={{ width: '200px', padding: '5px' }}>
                <InputLabel id="domain-label">Domain</InputLabel>
                <Select
                    labelId="domain-label"
                    id="domain-select"
                    multiple
                    value={selectedFilters.domain1}
                    onChange={(e) => handleFilterSelection(e, 'domain1')}
                    label="Domain"
                >
                    {domain?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={{ width: '200px', padding: '5px' }}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                    labelId="gender-label"
                    id="gender-select"
                    multiple
                    value={selectedFilters.gender}
                    onChange={(e) => handleFilterSelection(e, 'gender')}
                    label="Gender"
                >
                    {gender?.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={{ width: '200px', padding: '5px' }}>
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                    labelId="availability-label"
                    id="availability-select"
                    multiple
                    value={selectedFilters.availability}
                    onChange={(e) => handleFilterSelection(e, 'availability')}
                    label="Availability"
                >
                    <MenuItem value={true}>
                        Available
                    </MenuItem>
                    <MenuItem value={false}>
                        Unavailable
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );

};

export default UsersList;
/* eslint-enable */
