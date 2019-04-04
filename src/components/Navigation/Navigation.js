import React from 'react';

import classes from './Navigation.module.css';

const navigation = (props) => {
    return (
            <div className={classes.Modal}>{props.children}</div>
    )
}

export default navigation;
