'use client'

import React, { useState } from 'react'
import Image from 'next/image';
const empty = require('../../public/Empty.png');

type Props = {
    image: string;
}

export default function CarImage({ image }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <Image src={image ? `data:image/png;base64, ${image}` : empty}
            alt=''
            fill
            priority
            className={`object-cover group-hover:opacity-75 duration-700 ease-in-out
            ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
            sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 25 vw'
            onLoad={()=>setIsLoading(false)}
        />
    )
}
