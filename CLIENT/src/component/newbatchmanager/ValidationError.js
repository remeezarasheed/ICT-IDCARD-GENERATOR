import React from 'react';

function ValidationError({message}) {

    
    return (
        <div>
           <p className="errormessage">{message}</p>
        </div>
    );
}

export default ValidationError;