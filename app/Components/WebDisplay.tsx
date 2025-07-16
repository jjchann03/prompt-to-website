import React, { useState } from "react";
import { MdFullscreen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface Props {
  url: string;
}

const WebDisplay: React.FC<Props> = ({ url }) => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div
      className={`screen ${fullscreen ? 'w-full h-screen fixed top-0 left-0 z-4 bg-black' : 'w-[50%] min-h-[100%]'} px-[0.8rem] py-[1rem]`}
    >
      <div className='iframe-controls h-[8%] flex justify-between items-center px-[0.5rem] bg-[#212121] rounded-t-[7px]'>
        <p className='text-xs font-semibold text-white'>Website display</p>
        <button onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen? 
                <RxCross2 className="text-xl font-[600] text-white hover:scale-110 transition-transform"/>
                :
                <MdFullscreen className='text-2xl text-white hover:scale-110 transition-transform' />
            }
        </button>
      </div>

      <iframe
        title='Generated Code'
        src={url}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        className='w-full h-[92%] rounded-b-[7px]'
      />
    </div>
  );
};

export default WebDisplay;
