import React from 'react'
import AuctionCard from './AuctionCard';

async function getData() {
    const res = await fetch('http://localhost:6001/search?pageSize=10');
    if(!res.ok) throw new Error('Ошибка получения данных');
    return res.json()
}

export default async function Listings() {
    const data = await getData();    
  return (
    <div className='grid grid-cols-5 gap-6'>
        {data && data.results.map((auction: any, index: number) =>{
            return (
                <AuctionCard auction={auction} key={index} />
            )
        })}
    </div>
  )
}
