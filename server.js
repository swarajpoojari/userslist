const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './frontend/src/.env') });

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User model
const User = mongoose.model('users', {
    first_name: String,
    last_name: String,
    email: String,
    domain: String,
    gender: String,
    available: String,
    avatar: String
});
// console.log(User);

// Team model
const Team = mongoose.model('teams', {
    name: String,
    id: Number,
    userIds: [Number]
});

// CRUD API endpoints for users

// GET all users with filtering, searching, and pagination
app.get('/api/users', async (req, res) => {
    try {
        const { page = 1, limit = 20, search, domain, gender, availability } = req.query;

        // Building the filter object
        const filter = {};
        if (search) {
            filter.first_name = { $regex: search, $options: 'i' }; // Case-insensitive search by name
        }
        if (domain) {
            filter.domain = domain;
        }
        if (gender) {
            filter.gender = gender;
        }
        if (availability) {
            filter.available = availability;
        }

        // Fetch users with pagination and applied filters
        let query = User.find();
        if (Object.keys(filter).length > 0) {
            query = query.where(filter);
        }
        // console.log(query)
        const users = await query
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        console.log(users.length)
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all users
app.get('/api/totalUsers', async (req, res) => {
    try {

        // Fetch users with pagination and applied filters
        const totalUsers = await User.find()
        res.json(totalUsers);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: 'Server error' });
    }
});

// GET all users with filtered domain
app.get('/api/users/domain', async (req, res) => {
    try {

        // Fetch users with pagination and applied filters
        const domain = await User.distinct('domain')
        res.json(domain);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: 'Server error' });
    }
});

// GET all users with filtered gender
app.get('/api/users/gender', async (req, res) => {
    try {

        // Fetch users with pagination and applied filters
        const gender = await User.distinct('gender')
        res.json(gender);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: 'Server error' });
    }
});
// GET all users with filtered availability
app.get('/api/users/availability', async (req, res) => {
    try {

        // Fetch users with pagination and applied filters
        const available = await User.distinct('available')
        res.json(available);
        // console.log(res.json(available))
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: 'Server error' });
    }
});

// GET specific user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        console.log(userId)

        // Find the user by ID in the database
        const user = await User.findOne({ id: userId })
        res.json(user)

        if (!user) {
            // If no user is found with the specified ID, return a 404 Not Found response
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (error) {
        // If an error occurs while querying the database, return a 500 Internal Server Error response
        console.error('Error retrieving user by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create a new user
app.post('/api/users', async (req, res) => {
    const { id, first_name, last_name, email, domain, gender, available, avatar } = req.body;

    try {
        const newUser = new User({ id, first_name, last_name, email, domain, gender, available, avatar });
        await newUser.save();
        res.status(201).json(newUser);
        console.log(newUser)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update an existing user
app.put('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { id, first_name, last_name, domain, available, email, gender, avatar } = req.body;

    try {
        let user = await User.findOne({ id: userId })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.id = id;
        user.first_name = first_name;
        user.last_name = last_name;
        user.domain = domain;
        user.email = email;
        user.available = Boolean(available);
        user.gender = gender;
        user.avatar = avatar;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a user
app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        let user = await User.findOne({ id: userId })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Team API endpoints

// POST create a new team by selecting users from the list with unique domains and availability
app.post('/api/team', async (req, res) => {
    const { name, id, userIds } = req.body;
    // console.log(req.body)

    try {
        // Find users with the given user IDs
        const users = await User.find({ id: { $in: userIds } });

        // Create a new team with the provided name and user IDs
        const newTeam = new Team({ name, id, userIds });

        // Save the new team to the database
        await newTeam.save();

        // Send the newly created team as the response
        res.json(newTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET retrieve the details of a specific team by ID
app.get('/api/team/:id', async (req, res) => {
    const teamId = req.params.id;

    try {
        const team = await Team.findById(teamId).populate('users');
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
