'use client'

import { useAuctionStore } from '@/hooks/useAuctionStore';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, AuctionFinished, Bid } from '@/types';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from 'next-auth';
import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AuctionCreatedToast from '../components/AuctionCreatedToast';
import { getDetailedViewData } from '../actions/AuctionAction';
import AuctionFinishedToast from '../components/AuctionFinishedToast';

type Props = {
    children: ReactNode;
    user: User | null;
}

export default function SignalRProvider({ children, user }: Props) {

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:6001/notifications')
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Коннект установлен с хабом уведомлений');
                    connection.on('BidPlaced', (bid: Bid) => {
                        if (bid.bidStatus.includes('Принято')) {
                            setCurrentPrice(bid.auctionId, bid.amount);
                        }
                        addBid(bid);
                    })

                    connection.on('AuctionCreated', (auction: Auction) => {
                        if (user?.login !== auction.seller) {
                            return toast((p) => (                                
                                <AuctionCreatedToast auction={auction} toastId={p.id}/>                                                                    
                            ),
                            { duration: 10000 });
                        }
                    })

                    connection.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
                        const auction = getDetailedViewData(finishedAuction.auctionId);
                        return toast.promise(auction, {
                            loading: 'Загрузка...',
                            success: (auction) =>
                                <AuctionFinishedToast
                                    finishedAuction={finishedAuction}
                                    auction={auction}
                                />,
                            error: (err) => 'Аукцион завершен!'
                        }, { success: { duration: 10000, icon: null } })
                    })

                }).catch(err => console.log(err));
        }

        return () => {
            connection?.stop();
        }
    }, [connection, setCurrentPrice]);

    return (
        children
    )
}
