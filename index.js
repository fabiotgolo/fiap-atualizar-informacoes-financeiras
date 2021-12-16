const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Financeiro = require("./model/financeiro");
const auth = require("./middleware/auth");
const urlbd = "mongodb+srv://fabiotg:Ba123456@clustercliente.zbihk.mongodb.net/database?retryWrites=true&w=majority";
//Professor, mantive o endereço aqui porque esse usuário e senha são provisórios, depois da avaliação vou deletar.

mongoose.connect(urlbd, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conectado ao DB'))
.catch((e) => console.log('erro -> ',e))

const confCors = {
    origin: "*",
    optionSuccessStatus: 200
}

const app = express()

app.use(express.json())
app.use(cors())

app.post("/api/financeiro/cadastrar", cors(confCors),auth,(req,res)=>{
    const data = new Financeiro(req.body)
    data.save().then((rs)=>{
        res.status(201).send({
            out:'Registro inserido com sucesso',
            payload:rs
        })
    }).catch((erro)=>res.status(400).send({
        out:`erro -> ${erro}`
    }))
})



app.put("/api/financeiro/atualizar/:id", cors(confCors),auth,(req, res) => {
    Financeiro.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        (erro, rs) => {
            if (erro) {
                return res.status(400).send({
                    output: "Erro ao atualizar",
                    error: erro
                })
            } else {
                res.status(200).send({
                    output: "Registro atualizado com sucesso",
                    payload: rs
                })
            }
        }
    )
})


app.use((req, res) => {
    res.type("application/json")
    res.status(404).send({
        output: "Rota Inexistente"
    })
})


app.listen(4020, () => console.log('Rodando na porta 4020'));

