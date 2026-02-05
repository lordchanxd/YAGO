const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/order",(req,res)=>{
  const orders = JSON.parse(fs.readFileSync("orders.json"));
  orders.push(req.body);
  fs.writeFileSync("orders.json",JSON.stringify(orders,null,2));
  res.send({ok:true});
});

app.get("/orders",(req,res)=>{
  res.send(JSON.parse(fs.readFileSync("orders.json")));
});

app.listen(3000,()=>console.log("Server çalışıyor ❤️"));
