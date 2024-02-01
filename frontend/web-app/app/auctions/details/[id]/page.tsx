import React from 'react'

interface Props {
    params:{
        id: string;
    }    
}

export default function Details(prop: Props) {
    return (
        <div>Details for {prop.params.id}</div>
    )
}
