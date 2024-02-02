import Heading from '@/app/components/Heading'
import React from 'react'
import AuctionForm from '../../AuctionForm'
import { getDetailedViewData } from '@/app/actions/AuctionAction'

export default async function Update({params}:{params:{id: string}}) {

    const data = await getDetailedViewData(params.id);

    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <Heading title='Редактирование аукциона' subtitle='Отредактируйте данные ниже' />
            <AuctionForm auction={data} />
        </div>
    )
}
