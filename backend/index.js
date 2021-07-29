const { v4: uuidv4 } = require('uuid');
const express = require('express')
const fs = require('fs').promises
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const PORT = 3001
let loadedData

const getTodos = async _ => {
    try {
        console.log('reading json file')
        const json = await fs
            .readFile('data.json')
        const data = JSON.parse(json)
        return data
    } catch (error) {
        console.log('json file does not exist, creating it', error)
        return {}
    }
}

app.get(
    '/todos',
    (req, res) => {
        try {
            res
                .json(loadedData)
        } catch (error) {
            res
                .status(500)
                .json({
                    error
                })
        }
    }
)

app.post(
    '/todo',
    (req, res) => {
        try {
            const id = uuidv4()
            const { body } = req
            const payload = {
                id,
                "text": body.text,
                "done": body.done ? body.done : false
            }
            loadedData[id] = payload
            res
                .json(payload)
        } catch (error) {
            console.log(error)
            res
                .status(500)
                .json({
                    error
                })
        }
    }
)

app.put(
    '/todo/:id',
    (req, res) => {
        try {
            const { body } = req
            const todoId = req.params.id
            if (body.text)
                loadedData[todoId].text = body.text
            if ('done' in body)
                loadedData[todoId].done = body.done
            res
                .json(loadedData[todoId])
        } catch (error) {
            console.log(error)
            res
                .status(500)
                .json({
                    error
                })
        }
    }
)

app.delete(
    '/todo/:id',
    (req, res) => {
        try {
            const todoId = req.params.id
            const tmp = loadedData[todoId]
            delete loadedData[todoId]
            res.json(tmp)
        } catch (error) {
            res.status(500).json({
                error
            })
        }
    }
)

const syncTodos = async (data) => {
    const json = JSON.stringify(data)
    try {
        await fs
            .writeFile(
                'data.json',
                json
            )
    } catch (error) {
        console.log('error while saving file', error)
    }
}

app.listen(PORT, async () => {
    loadedData = await getTodos()
    setTimeout(
        _ => {
            setInterval(
                async _ => await syncTodos(loadedData),
                2000
            )
        },
        1000
    )
    console.log(`app listening at http://localhost:${PORT}`)
})