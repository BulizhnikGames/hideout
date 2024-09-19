import React from "react";
import LightText from "./light";

const Admin = ({game} : {game : (a: string) => void}) => {
    return (
        <div
            className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
            <span className='py-4 text-center text-4xl'><LightText text={'НАСТРОЙКИ'}/>{'\n'}</span>
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => game('0')}>
                Еда = время пребывания
            </button>
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => game('1')}>
                Увеличить кол-во еды в 2 раза
            </button>
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => game('2')}>
                Новый апокалипсис
            </button>
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => game('3')}>
                Новый бункер
            </button>
        </div>
    )
}

export default Admin