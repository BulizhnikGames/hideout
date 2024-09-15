import React from "react";

const LockText = ({text, lock}) => {
    if (lock){
        return(
            <a className='text-lightred'>{text}</a>
        )
    } else {
        return(
            <a className='text-lightgreen'>{text}</a>
        )
    }
}

export default LockText