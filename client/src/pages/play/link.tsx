import React from 'react'
import {useRouter} from "next/router";
import {CiStickyNote} from "react-icons/ci";

const LinkBox = () => {
    const router = useRouter()

    const copyLinkToRoom = (e: React.SyntheticEvent) => {
        e.preventDefault()
        navigator.clipboard.writeText(`http://localhost:3000/play/${router.query.room}`)
        return
    }

    /*return (
        <button className='p-6 mt-6 rounded-md bg-lightblue text-white text-3xl font-bold' onClick={copyLinkToRoom}>
            http://hideout/play/{router.query.room}
        </button>
    )*/
    return (
        <div className='p-4 flex justify-center items-end space-x-2'>
            <span className='py-6 rounded-md text-lightblue text-6xl font-bold'>
                http://hideout/play/{router.query.room}
            </span>
            <button
                className='bg-white hover:bg-gray-400 rounded inline-flex items-center' onClick={copyLinkToRoom}>
                <CiStickyNote size='100'/>
            </button>
        </div>

    )
}

export default LinkBox;