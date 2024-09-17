import React, {useState} from "react";
import LightText from "./light";
import ErrorText from "./errortext";

const Admin = ({game, char} : {game : (a: string) => void, char : (a: number, b: string) => void}) => {
    const [newInput, changeNew] = useState('0')
    const [deleteInput, changeDelete] = useState('0')

    const isNumeric = (s: string) =>{
        return !isNaN(Number(s))
    }

    const newButtonText = () => {
        if (isNumeric(newInput) && Number(newInput) >= 3 && Number(newInput) <= 7){
            switch (Number(newInput)){
                case 3:
                    return 'здоровье'
                case 4:
                    return 'работа'
                case 5:
                    return 'хобби'
                case 6:
                    return 'фобия'
                case 7:
                    return 'предмет'
            }
        } else{
            return
        }
    }

    const deleteButtonText = () => {
        if (isNumeric(deleteInput) && Number(deleteInput) >= 5 && Number(deleteInput) <= 7){
            switch (Number(deleteInput)){
                case 5:
                    return 'хобби'
                case 6:
                    return 'фобию'
                case 7:
                    return 'предмет'
            }
        } else{
            return
        }
    }

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
            <input
                placeholder='ID'
                className='py-1 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                value={newInput}
                onChange={(e) => changeNew(e.target.value)}
                maxLength={1}
            />
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => char(0, newInput)}>
                Новое <ErrorText text={newButtonText()}/>
            </button>
            <input
                placeholder='ID'
                className='py-1 rounded-md border-2 border-grey font-bold text-3xl text-center focus:outline-none focus:border-blue'
                value={deleteInput}
                onChange={(e) => changeDelete(e.target.value)}
                maxLength={1}
            />
            <button className='py-1 bg-blue rounded-md align-text-top' onClick={() => char(1, newInput)}>
                Удалить <ErrorText text={deleteButtonText()}/>
            </button>
        </div>
    )
}

export default Admin