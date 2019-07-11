import React from 'react';
import {notFound as message} from "../messages"

/**
 * Empty pages component
 */
const NotFound = () => {
    return (
        <div className={'not-found'}>
            <p>Not Found</p>
            <p>{message}</p>
        </div>
    )
};

export default NotFound