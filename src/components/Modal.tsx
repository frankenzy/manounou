import React,{useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


interface CustomProps {
    children: React.ReactNode
}
const Modal = ({children}:CustomProps)=>{

    const [isOpen,setIsOpen] = useState(false);

    return(
        <div>
            <div  onClick={() => setIsOpen(!isOpen)} 
                className="border p-2 cursor-pointer flex items-center justify-center"
                aria-label="Icon"
            >

                <FontAwesomeIcon icon={faChevronDown} className="w-4" />
               
                
            </div>
            {isOpen && (
                <div className="absolute border bg-slate-200 mt-1 w-full z-10">
                    {/* TODO: ajouter du contennu */}
                  {/* {{ children}} */}
                </div>
            )}
        </div>
    )

}

export default Modal;