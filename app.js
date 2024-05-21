const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())
const port = 3000;
require('dotenv').config();

const expenseSchema = mongoose.Schema({

    name:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    amount:{
        type: Number,
        required:true,
        default: 0
    },
    date:{
        type: Date,
        default:Date.now
    }

});
const Expense = mongoose.model("expense",expenseSchema);
const URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@expense-calculation.vozlpzg.mongodb.net/expenses?retryWrites=true&w=majority&appName=expense-calculation`
app.get('/', (req, res) => {  res.send('Hello World!')});

app.post('/api/expense',async (req,res)=>{

    try{
        const expense = await Expense.create(JSON.parse(req.body));
        res.status(200).json(expense);
    }
    catch(e){
        res.status(500).json({error:e});
    }
});

app.get('/api/expenses',async (req,res)=>{

    try{
        const expenses = await Expense.find({});
        res.status(200).json(expenses);
    }
    catch(e){
        res.status(500).json({error:e});
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    if(!expense){
        return  res.send("Expense not found");
    }
    res.send(expense);
  } catch (error) {
    res.status(500).send(error);
  }
});

mongoose.connect(URL)
.then(()=>{
    console.log("Connected to DB");
    app.listen(port, () => {  console.log(`Expense app listening on port ${port}`)});
})
.catch((e)=>{
    console.log("connection failed ---",e);
})

