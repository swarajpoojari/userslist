import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import './style.css'
import { useRef, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        padding: '8px',
        width: '100%',
        boxSizing: 'border-box'
    },
    paginationWrapper: {
        display: 'flex',
        flex: '1',
        overflow: 'hidden',
    },
    pagination: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
    },
    pageItem: {
        margin: '0 4px',
    },
    button: {
        minWidth: 36,
        padding: '8px',
    },
    activeButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    inactiveButton: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    },
}));

const Pagination = ({ totalUsersLength, usersPerPage, currentPage, paginate }) => {
    const classes = useStyles();
    const paginationRef = useRef(null);
    // console.log("pageNumbers" + pageNumbers)

    const pageNumbers = [];

    console.log(totalUsersLength, usersPerPage)
    for (let i = 1; i <= Math.ceil(totalUsersLength / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    console.log(pageNumbers);


    useEffect(() => {
        // Add event listener to track scroll position changes
        const handleScroll = () => {
            const container = paginationRef.current;
            const { scrollLeft, scrollWidth, offsetWidth } = container;

            // Disable left button when at the beginning of the scroll
            const isAtBeginning = scrollLeft === 0;
            const leftButton = document.getElementById('leftButton');
            leftButton.disabled = isAtBeginning;
            console.log(leftButton.disabled)

            // Disable right button when at the end of the scroll
            const isAtEnd = scrollLeft + offsetWidth === scrollWidth;
            const rightButton = document.getElementById('rightButton');
            rightButton.disabled = isAtEnd;

            // console.log(scrollLeft, offsetWidth, scrollWidth)
        };

        // Attach scroll event listener
        const container = paginationRef.current;
        container.addEventListener('scroll', handleScroll);

        // Remove event listener on component unmount
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navigation = (dir) => {
        const container = paginationRef.current;

        const scrollAmount =
            dir === 'left'
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: 'smooth',
        });
    };



    return (
        < nav id='paginationContainer' className={classes.paginationContainer} >
            <IconButton id="leftButton" className={classes.button} onClick={() => navigation('left')} disabled={false}>
                <ArrowBackIcon />
            </IconButton>
            <div ref={paginationRef} id='paginationWrapper' className={classes.paginationWrapper}>
                <ul id="pagination" className={classes.pagination}>
                    {pageNumbers?.map((number) => (
                        <li key={number} className={classes.pageItem}>
                            <Button
                                onClick={() => paginate(number)}
                                className={number === currentPage ? classes.activeButton : classes.inactiveButton}
                            >
                                {number}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <IconButton id="rightButton" className={classes.button} onClick={() => navigation('right')} disabled={false}>
                <ArrowForwardIcon />
            </IconButton>
        </nav >
    );
};

export default Pagination;
