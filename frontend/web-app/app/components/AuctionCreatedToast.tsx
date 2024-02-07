import { Auction } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
const empty = require('../../public/Empty.png');

type Props = {
    auction: Auction;
    toastId: string;
}

export default function AuctionCreatedToast({ auction, toastId }: Props) {
    return (
        <div>
            <div className='flex flex-row-reverse' >
                <button onClick={() => toast.dismiss(toastId)}>X</button>
            </div>
            <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
                <div className='flex flex-row items-center gap-2'>
                    <Image
                        src={auction.image ? `data:image/png;base64 , ${auction.image}` : empty}
                        alt=''
                        height={80}
                        width={80}
                        className='rounded-lg'
                    />
                    <span>Новый аукцион {auction.make} {auction.model} был создан</span>
                </div>
            </Link>
        </div>

    )
}
