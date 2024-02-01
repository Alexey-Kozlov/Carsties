'use client'

import React, { useState } from 'react'
import { updateAuctionTest } from '../actions/AuctionAction';
import { Button } from 'flowbite-react';

export default function UpdateTest() {

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>();

    const DoUpdate = () =>{
        setResult(undefined);
        setLoading(true);
        updateAuctionTest()
            .then(res => setResult(res))
            .finally(() => setLoading(false))
    }

    return (
        <div className='flex items-center gap-4 mt-4'>
            <Button outline isProcessing={loading} onClick={DoUpdate}>
                Обновить аукцион
            </Button>
            <div>
                {JSON.stringify(result, null, 2)}
            </div>
        </div>
    )
}
