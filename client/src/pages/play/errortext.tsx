import React from 'react'

const ErrorText = ({text} : {text: string | undefined}) => {
    if (text === undefined){
        return(
            <a className='text-red'>ОШИБКА</a>
        )
    } else {
        return(
            <a className='text-white'>{text}</a>
        )
    }
}

export default ErrorText