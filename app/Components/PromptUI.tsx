import React from "react"
import { useState } from "react";
import { useCodeGen } from "../Context/CodeGenContext";
import { FaArrowRight } from "react-icons/fa";

interface Props{
    generateWebsite: (prompt: string) => void;
}

const PromptUI: React.FC<Props> = ({generateWebsite}) => {
    const [prompt,setPrompt] = useState<string>('');
    const { isCodeGenerated } = useCodeGen();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generateWebsite(prompt);
    }

    // const promptStyle: React.CSSProperties = {
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     height: "content",
    //     width: "60%"
    // }
    // const codePromptStyle: React.CSSProperties = {
    //     height: "100%",
    //     width: "100%",
    //     overflow: "hidden"
    // }

    const formStyle: React.CSSProperties = {
        margin: "2rem 1rem 0 1rem",
        flexDirection: 'column',
        width: "55%",
        padding: "0.8rem 1rem"
    }
    const codeFormStyle: React.CSSProperties = {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.8rem",
    }

    const taStyle: React.CSSProperties = {
        height: "7rem",
        padding: "1rem",
        borderRadius: "7px",
        width: "100%",
    }
    const codeTaStyle: React.CSSProperties = {
        height: "3rem",
        padding: "0.8rem 1.6rem",
        boxSizing: "content-box",
        borderRadius: "2rem",
        width: "70%"
    }

    const buttonStyle: React.CSSProperties = {
        width: "20%",
        borderRadius: "7px",
        padding: "8px 0",
        fontSize: "0.85rem",
        margin: "2.5rem auto 0",
    }
    const codeButtonStyle: React.CSSProperties = {
        borderRadius: "100%",
        padding: "10px",
        marginLeft: "1rem"
    }

    return (
        <form onSubmit={handleSubmit} 
        className="flex"
        style={isCodeGenerated ? codeFormStyle : formStyle }
        >
            <textarea
            className="prompt-textarea  
            bg-[#2c2c2c] focus:bg-[#212121] focus:outline-none
            resize-none"
            style={isCodeGenerated ? codeTaStyle : taStyle }
            placeholder="Describe the website you want..."
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            />

            <button type="submit" 
            style={isCodeGenerated ? codeButtonStyle : buttonStyle}
            className=" bg-[#3fb000] hover:bg-[#4dd600] font-semibold"
            >
                {isCodeGenerated? <FaArrowRight /> : "Generate Website"}
            </button>
        </form>
    );
}

export default PromptUI