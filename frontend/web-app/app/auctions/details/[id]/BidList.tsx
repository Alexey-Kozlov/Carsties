'use client'

import { getBidsForAuction } from '@/app/actions/AuctionAction';
import Heading from '@/app/components/Heading';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, Bid } from '@/types';
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import BidItem from './BidItem';
import { numberWithCommas } from '@/app/lib/numberWithComma';
import EmptyFilter from '@/app/components/EmptyFilter';
import BidForm from './BidForm';

type Props = {
    user: User | null;
    auction: Auction
}

export default function BidList({ user, auction }: Props) {
    const [loading, setLoading] = useState(true);
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);
    const open = useBidStore(state => state.open);
    const setOpen = useBidStore(state => state.setOpen);
    const openForBids = new Date(auction.auctionEnd) > new Date();

    const highBid = bids.reduce((prev, current) => {
        return prev > current.amount 
            ? prev 
            : current.bidStatus.includes('Принято') ? current.amount: prev
    }, 0);

    useEffect(() => {
        getBidsForAuction(auction.id)
            .then((res: any) => {
                if (res.error) {
                    throw res.error;
                }
                setBids(res as Bid[]);
            }).catch(err => {
                toast.error(err.message);
            }).finally(() => setLoading(false))
    }, [auction.id, setLoading, setBids]);

    useEffect(() => {
        setOpen(openForBids);
    },[openForBids, setOpen]);

    if (loading) return <span>Загрузка предложений...</span>

    return (
        <div className='rounded-lg shadow-md'>
            <div className='py-2 px-4 bg-white'>
                <div className='sticky top-0 bg-white p-2'>
                    <Heading title={`Текущее лучшее предложение - ${numberWithCommas(highBid)} руб`} />
                </div>
            </div>

            <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
                {bids.length === 0 ? (
                    <EmptyFilter title='Нет предложений для этого аукциона'
                        subtitle='Сделайте предложение' />
                ) : (
                    <>
                        {bids.map(bid => (
                            <BidItem key={bid.id} bid={bid} />
                        ))}
                    </>
                )}
            </div>
            <div className='px-2 pb-2 text-gray-500'>
                {!open ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Аукцион завершен
                    </div>
                ) : !user ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Войдите в систему чтобы делать заявки
                    </div>
                ) : user && user.login ===auction.seller ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Невозможно сделать заявку для собственного аукциона
                    </div>
                ) : (
                    <BidForm auctionId={auction.id} highBid={highBid} />
                )}                
            </div>
        </div>
    )
}
