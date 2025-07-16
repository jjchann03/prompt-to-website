import React from "react";
import { CgSpinner } from "react-icons/cg";


interface Props{
    loading: boolean
}

const Loading: React.FC<Props> = ({loading}) => {

    return(
        <div 
        style={loading ? {display: 'flex'}:{display: 'none'}}
        className="min-w-screen min-h-screen flex-col items-center justify-center z-3 bg-[#000000ad] absolute">
            <div className="spinner-div"><CgSpinner className="spinner"/></div>
            <p className="text-lg">Loading<span className="dots"></span></p>
        </div>
    );
}

export default Loading;