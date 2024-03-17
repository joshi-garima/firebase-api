require('dotenv').config()
const express = require('express')
const admin = require('firebase-admin')
const cors = require('cors')
const credentials = require('./key.json')

const port = process.env.PORT || 8000
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))


admin.initializeApp({
    credential: admin.credential.cert(credentials)
})
const db  =  admin.firestore()

app.get('/', (req,res)=>{
    res.send('Welcome to FireBase API template')
})


app.post('/create', async (req,res)=>{
    try {
        const id = req.body.email
        const userDetail = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        const result = await db.collection("users").add(userDetail)
        res.status(200).json({message: result})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.get('/read/all', async (req, res)=>{
    try {
        const userRef = db.collection("users")
        const response = await userRef.get()
        let resArray =  []
        response.forEach(doc =>{
            resArray.push(doc.data())
        })
        res.send(resArray)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/read/:id', async(req,res)=>{
    try{
        const userRef = db.collection("users").doc(req.params.id)
        const response = await userRef.get();

        res.status(200).json({message: response.data()})

    }catch(error){
        res.status(500).json({message: error.message})
    }

})


app.put('/update/:id', async(req,res)=>{
    try {
        const id = req.params.id

        const userRef = await db.collection("users").doc(id)
        .update()
        if (!userRef){
           return res.status(404).json({message: "user not in databbase."})
        }
        const response = await userRef.get()

        res.status(200).json({message: response.data()})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.listen(port,()=>{
    console.log(`This is running on port ${port}`);
} )

