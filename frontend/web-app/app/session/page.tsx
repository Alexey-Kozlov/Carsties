import React from 'react'
import { GetSession, getTokenWorkaround } from '../actions/AuthActions'
import Heading from '../components/Heading';
import UpdateTest from './UpdateTest';

export default async function Session() {

    const session = await GetSession();    
    const token = await getTokenWorkaround();

    return (
        <div>
            <Heading title='Текущие сессии' />
            <div className='bg-blue-200 border-2 border-blue-500'>
                <h3 className='text-lg'>Сессии</h3>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
            <UpdateTest />
            <div className='bg-green-200 border-2 border-blue-500 mt-4'>
                <h3 className='text-lg'>Токен</h3>
                <pre className='overflow-auto'>{JSON.stringify(token, null, 2)}</pre>
            </div>
        </div>
    )
}
