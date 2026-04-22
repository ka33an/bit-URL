import React, { use, useState } from 'react'
import axios from 'axios'
import { QRCode } from 'react-qr-code'  
import QRCodeGenerator from 'qrcode'

const API_BASE_URL=import.meta.env.VITE_BACKEND_URL

function App() {
  const[url,setUrl]=useState("")
  const[shortUrl,setShortUrl]=useState("")
  const[copied,setCopied]=useState(false)
  const [qrimage,setQrimage]=useState("")

  const handleShorten = async ()=>{
    if(!url){
      return
    }
    try{
        const res= await axios.post(`${API_BASE_URL}/shorten`,{
          originalUrl:url,
        })
        const newShortUrl= res.data.shortURL
        setShortUrl(newShortUrl)
        setCopied(false)

        const qr = await QRCodeGenerator.toDataURL(newShortUrl)
        setQrimage(qr)
    }catch(error){
      console.log(error)
      alert("something went wrong")
    }

  

  }
  const handlecopy=()=>{
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(()=>setCopied(false),2000)
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">

      <h1 className='text-4xl font-bold mb-4 text-center'>
        bit-URL
      </h1>
   
      <div className='flex flex-col gap-3 w-full max-w-3xl'>
        <input type="text" placeholder="Enter URL"  className="input input-bordered input-success w-full"
        value={url} onChange={(e)=>setUrl(e.target.value)}/>
        <button onClick ={handleShorten} className='btn btn-primary w-full sm:w-auto'>
          Shorten URL
        </button>
      </div>
      {shortUrl && (
        <div className='flex flex-col items-center max-w-3xl w-full'> 
          <p className='font-medium mb-2'> Your Short Link:</p>
          <a className="link link-primary break-all " target='_blank' href={shortUrl}> {shortUrl}</a>
          <button onClick={handlecopy} className={`btn mt-2 w-full ${copied ? "btn-success" : "btn-secondary"}`}>
            {copied ?  "Copied" :"Copy"}
          </button>
          <div className='bg-white mt-6 p-4 shadow rounded-lg '>
            <p className='mb-2 text-center font-semibold text-gray-800 '>Scan QR-Code</p>
            <QRCode value ={shortUrl} size={180}/>
          </div>
          {qrimage && (
            <a  className="btn btn-accent mt-3 w-full" download="QRCode.png" href={qrimage}>Download QRcode</a>
          )}
        </div>
      )}

    </div>
  )
}

export default App