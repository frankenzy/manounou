import React from "react";



interface ListProps {
  children: React.ReactNode;
}

const Section = ({children}: ListProps) => {
    return (
        <div className="flex flex-col w-full py-4">
            { children }
        </div>
    );
};

export default Section;