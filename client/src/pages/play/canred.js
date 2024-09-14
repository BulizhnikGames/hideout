import React from "react";

const RedText = ({text, r}) => {
    if (r){
        return(
            <a className='text-black'>{text}</a>
        )
    } else {
        return(
            <a className='text-red'>{text}</a>
        )
    }
}

export default RedText