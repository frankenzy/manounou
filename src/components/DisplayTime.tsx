import React from 'react';
import { format } from 'date-fns';

interface ComponentProps{
    className?:string;
}
export default function DisplayTime({className}:ComponentProps){
    const fixedTime = new Date('2023-10-01T14:40:00');
    const formattedTime = format(fixedTime, 'hh:mm a');

    return(
        <>
             <span className={className}>{formattedTime}</span>
        </>
    )
}