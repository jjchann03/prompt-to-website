"use client";

import React, { useEffect, useState } from 'react';
import PromptUI from './Components/PromptUI';
import { CodeGenProvider, useCodeGen } from './Context/CodeGenContext';
import { getDisplayName } from 'next/dist/shared/lib/utils';
import { MdFullscreen } from "react-icons/md";
import { IoCopy } from "react-icons/io5";

function App() {
  const [code,setCode] = useState<String>('');
  const [loading,setLoading] = useState<Boolean>(false);
  const [url,setUrl] = useState<String>('');
  const { isCodeGenerated, setIsCodeGenerated } = useCodeGen();

  console.log(isCodeGenerated);
  useEffect(()=>{

  },[url])

  const generateWebsite = async(prompt: string) => {
    setLoading(true);
    setCode(''); //Sets the previous code to empty
    try{
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-type':'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const data = await response.json(); // response is code in the form of json
      if(data.code){
        setCode(data.code);
        console.log("Code generate: ", data.code);
      }

      setIsCodeGenerated(true);

      const blob = new Blob([data.code], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      setUrl(url);
    }catch(error: any){
      console.error("Failed to fetch code ", error);
    }finally{
      setLoading(false);
    }
  }

  const promptDiv = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:"url('https://res.cloudinary.com/dzwhk4bsm/image/upload/v1752087094/ChatGPT_Image_Jul_10_2025_12_12_53_AM_mysntu.png')",
    height: "100%"
  }
  const codePromptDiv = {
    height: "auto"
  }

  return (
    <div className='w-full flex h-screen' style={isCodeGenerated ? {flexDirection:'column-reverse'}:{}}>
      <div
      className='bg-[#282727a3] w-full bg-end bg-cover'
      style={isCodeGenerated ? codePromptDiv : promptDiv}
      >
        <div className='text-center' style={isCodeGenerated ? {display:'none'}:{display:'block'}}>
          <h1 className='text-[3rem] transform scale-y-110 leading-20 font-[600]'>
              B<span className='text-[#5444ff]'>ui</span>ld Some<span className='text-[#d549ff]'>th</span>ing <span className='text-[#ff4015]'>G</span>reat
          </h1>
          <p className='text-xl mt-[5px] text-[#ffbcac]'>Creating a website is no longer a hassle.</p>
          <p className='text-xl mt-[5px] text-[#ffbcac]'>Just write in what you want and we'll deliver it.</p>
        </div>
        <PromptUI generateWebsite={generateWebsite}/>
      </div>

      <div 
      style={isCodeGenerated?{display:'flex',flexGrow: "1"}:{display:'none'}}
      className='generated-code-container
      w-full h-[80%] bg-[#444444]'
      >
        <div 
        className='screen w-[50%] min-h-[100%] px-[0.8rem] py-[1rem]'
        >    
          <div className='iframe-controls h-[8%] flex justify-between items-center 
          px-[0.5rem] bg-[#212121] rounded-t-[7px]'>
            <p className='text-xs font-semibold'>Website display</p>
            <button><MdFullscreen className='text-2xl'/></button>
          </div>
          <iframe
            title='Generated Code' 
            src={`${url}`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className='w-full h-[92%] rounded-b-[7px]'
          />
        </div>

        <div className='code-display w-[50%] min-h-[100%] p-[1rem] overflow-hidden'>
          <div className='w-full overflow-hidden h-full'>
            <div className='iframe-controls h-[8%] flex justify-between items-center 
            px-[0.5rem] bg-[#212121] rounded-t-[7px]'>
              <p className='text-xs font-semibold'>Website Code</p>
              <button><IoCopy className='text-md'/></button>
            </div>
            <div className='w-full h-[92%] bg-black overflow-y-scroll rounded-b-[7px]'><p>{code}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
