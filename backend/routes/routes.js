const express = require("express")
const Url = require ("../models/url.js")
const {nanoid} = require("nanoid")
const router = express.Router();


router.post("/shorten",async (req,res)=>{
    try{
        const {originalUrl}= req.body
        if(!originalUrl){
            return res.status(400).json({message:"URL is required"})
        }
        try{
            new URL(originalUrl)
        }catch{ 
            return res.status(400).json({message:"URL is invalid"})
        }
        
        let shortId
        let exists = true

        while(exists){
            shortId=nanoid(8)
            exists = await Url.findOne({shortId}) // handle collision if it occurs 
        }

        const url = await Url.create({
            shortId, originalUrl
        })
       
        res.json({
            shortId:url.shortId,
            shortURL: `${process.env.BASE_URL}/${url.shortId}`,
        }) 

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})




router.get("/:shortId", async (req,res)=>{
   try{
        const shortId= req.params.shortId

        const url = await Url.findOne({shortId})
        if (!url){
            return res.status(404).json({message:"URL not found"})
        }
        url.clicks+=1
       await url.save()

       res.redirect(url.originalUrl )

   }catch (error){
    console.log(error)
    res.status(500).json({error:"Internal Server Error "})
   }
})


module.exports=router