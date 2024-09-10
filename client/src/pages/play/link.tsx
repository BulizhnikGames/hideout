import React from 'react'
import {WS_URL} from "../../../constants";
import {Router, useRouter} from "next/router";

const LinkBox = () => {
    const router = useRouter()

    const copyLinkToRoom = (e: React.SyntheticEvent) => {
        e.preventDefault()
        navigator.clipboard.writeText(`http://localhost:3000/play/${router.query.room}`)
        return
    }

    return (
        <button className='p-6 mt-6 rounded-md bg-lightblue text-white text-3xl font-bold' onClick={copyLinkToRoom}>
            http://hideout/play/{router.query.room}
        </button>
    )
}

export default LinkBox;