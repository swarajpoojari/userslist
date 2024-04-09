import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Button, Checkbox } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit'; import { useNavigate } from 'react-router-dom';

import './style.css'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    width: 340,
    height: 250,
    maxWidth: 400,
    margin: 'auto',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    border: ({ selected }) => `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'border-color 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  media: {
    width: 120,
    height: 100,
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1.3)
  },
  button: {
    margin: theme.spacing(0.3)
  }
}));

const UserCard = ({ user, onSelect, selected }) => {

  const classes = useStyles();

  const navigate = useNavigate();

  const handleUpdate = (route) => {

    navigate(route)
  }


  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.first_name}?`);
    if (confirmDelete) {
      try {
        // Send a DELETE request to the backend to delete the user by ID
        // await axios.delete(`/api/users/${user.id}`);
        console.log(user)
        await fetch(`http://localhost:5500/api/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        // Handle error
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 300 }} className={classes.card}>
      <CardMedia className={classes.media} image={user.avatar} title={user.first_namename} />
      <CardContent className={classes.userDetails}>
        <div>
          <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Domain: {user.domain}</Typography>
          <Typography>Availability: {user.available}</Typography>
        </div>
        <div className={classes.buttonsContainer}>
          <Checkbox onChange={onSelect} checked={selected} />
          <div>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => handleUpdate(`/api/users/${user.id}/edit`)}
            >
              Update
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default UserCard;
