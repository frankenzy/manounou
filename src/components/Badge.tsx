import React from 'react';



interface ComponentPros
{
    texte: string;
}
export default  function Badge({texte}:ComponentPros)
{
    return (
        <div>
            <span className=" text-white text-xs font-bold px-4 py-[2px] rounded-xl bg-slate-300">
                {texte}
            </span>
        </div>
    )
}