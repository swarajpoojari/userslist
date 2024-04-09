import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    pageCountContainer: {
        marginTop: theme.spacing(2),
        textAlign: 'center',
    },
}));

const PageCount = ({ users, usersPerPage }) => {
    const classes = useStyles();

    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className={classes.pageCountContainer}>
            <Typography variant="body1">
                Total Pages: {totalPages}
            </Typography>
        </div>
    );
};

export default PageCount;
