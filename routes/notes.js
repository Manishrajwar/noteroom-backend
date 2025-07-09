const express = require("express");
const router = express.Router();
const Note = require('../models/Note');

router.post("/create-noteroom" , async(req ,res)=>{
     try{

       
        const {title} = req.body;
        
        const note = await Note.create({title});

        return res.status(201).json({
            status:true ,
            id: note?._id, 
            message:"Successfuly created"
        })

     } catch(error){
         console.log("error",error);
     }
})
router.get("/get-all-noteroom" , async(req ,res)=>{
     try{

               
        const note = await Note.find({});

        return res.status(201).json({
            status:true ,
            allNotes: note,
            message:"Successfuly fetched"
        })

     } catch(error){
         console.log("error",error);
     }
})

module.exports = router;
