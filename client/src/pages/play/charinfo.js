import React from 'react';
import LightText from "@/pages/play/light";
import Blue from "@/pages/play/blue";

const Char = ({c}) => {
    if (c === null) {
        return (
            <div></div>
        )
    }
    return (
        <div className='space-y-3 flex flex-col align-top font-bold text-start text-3xl text-wrap leading-10 break-words'>
            <span className='py-4 text-center text-4xl'><LightText text={c.username}/>{'\n'}</span>
            <span><Blue text={'Главное:'}/> {c.main}</span>
            <span><Blue text={'Телосложение:'}/> {c.body}</span>
            <span><Blue text={'Здоровье:'}/> {c.health}</span>
            <span><Blue text={'Работа:'}/> {c.job}</span>
            <span><Blue text={'Хобби:'}/> {c.hobby}</span>
            <span><Blue text={'Фобия:'}/> {c.phobia}</span>
            <span><Blue text={'Предмет:'}/> {c.item}</span>
            <span><Blue text={'Доп информация:'}/> {c.info}</span>
            <span><Blue text={'Способность:'}/> {c.ability}</span>
        </div>
    )
}

export default Char