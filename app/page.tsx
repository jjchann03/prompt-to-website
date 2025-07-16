"use client";

import React, { useState } from 'react';
import PromptUI from './Components/PromptUI';
import { useCodeGen } from './Context/CodeGenContext';
import { IoCopy } from "react-icons/io5";
import Loading from './Components/Loading';
import WebDisplay from './Components/WebDisplay';

function App() {
  const [code,setCode] = useState<string>('');
  const [url,setUrl] = useState<string>('');
  const { isCodeGenerated, setIsCodeGenerated } = useCodeGen();
  const { loading, setLoading } = useCodeGen();

  const generateWebsite = async(prompt: string) => {
    setLoading(true);
    setCode(''); //Sets the previous code to empty
    //https://prompt-to-website-pnay.vercel.app/
    try{
      const response = await fetch('api/generate', {
        method: 'POST',
        headers: { 'Content-type':'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const data = await response.json(); // response is code in the form of json

      if(data.code){
        setCode(data.code);
        setIsCodeGenerated(true);
      }else{
        alert(data.error);
      }

      const blob = new Blob([data.code], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      setUrl(url);
    }catch(error: unknown){
      console.log("entered here")
      if (error instanceof Error) {
        console.log("Failed to fetch code ", error.message);
      } else {
        console.error("Unknown error occurred", error);
      } 
    }finally{
      setLoading(false);
    }
  }

  const handleCopyCode = async () => {
    try{
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    }catch(err){
      console.log(err);
      alert('Failed to copy. Please try again.')
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
      <Loading loading={loading}/>
      <div
      className='bg-[#282727a3] w-full bg-end bg-cover'
      style={isCodeGenerated ? codePromptDiv : promptDiv}
      >
        <div className='text-center' style={isCodeGenerated ? {display:'none'}:{display:'block'}}>
          <h1 className='text-[3rem] transform scale-y-110 leading-20 font-[600]'>
              B<span className='text-[#5444ff]'>ui</span>ld Some<span className='text-[#d549ff]'>th</span>ing <span className='text-[#ff4015]'>G</span>reat
          </h1>
          <p className='text-xl mt-[5px] text-[#ffbcac]'>Creating a website is no longer a hassle.</p>
          <p className='text-xl mt-[5px] text-[#ffbcac]'>Just write in what you want and we&rsquo;ll deliver it.</p>
        </div>
        <PromptUI generateWebsite={generateWebsite}/>
      </div>

      <div 
      style={isCodeGenerated?{display:'flex',flexGrow: "1"}:{display:'none'}}
      className='generated-code-container
      w-full h-[80%] bg-[#444444]'
      >
        <WebDisplay url={url}/>

        <div className='code-display w-[50%] min-h-[100%] p-[1rem] overflow-hidden'>
          <div className='w-full overflow-hidden h-full'>
            <div className='iframe-controls h-[8%] flex justify-between items-center 
            px-[0.5rem] bg-[#212121] rounded-t-[7px]'>
              <p className='text-xs font-semibold'>Website Code</p>
              <button onClick={handleCopyCode}><IoCopy className='text-md'/></button>
            </div>
            <div className='w-full h-[92%] bg-black overflow-y-scroll rounded-b-[7px] p-[0.5rem]'>
              <pre className="**whitespace-pre-wrap**">
                <code className="text-white text-sm">
                  {code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
