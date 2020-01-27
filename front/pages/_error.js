import React from 'react';
import Error from 'next/error';

export default ({ statusCode }) => {
    return (
        <div>
            <Error statusCode={statusCode} />
        </div>
    );
};
