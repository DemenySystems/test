import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from 'index.css'

const App = () => {
	const [todos, setTodos] = useState()
	useEffect(() => {
		getTodos()
	}, [])

	const getTodos = async _ => {
		try {
			const todos = []
			const { data } = await axios
				.get('http://localhost:3001/todos')
			Object
				.entries(data)
				.map(data => todos.push(data[1]))
			setTodos(todos)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div id='mainContainer'>
			<Input
				setTodos={setTodos}
				todos={todos}
			/>
			{todos &&
				todos.map(todo => {
					return (
						<TodoItem
							todo={todo}
							key={todo.id}
							todos={todos}
							setTodos={setTodos}
						/>
					)
				})
			}
		</div>
	);
}

const Input = ({
	setTodos,
	todos
}) => {
	const [input, setInput] = useState('')
	const handleSubmit = async () => {
		try {
			const { data } = await axios.post(
				'http://localhost:3001/todo',
				{
					text: input,
				}
			)
			setTodos([...todos, data])
			setInput('')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div id='inputContainer'>
			<div>Create a todo item</div>
			<input
				value={input}
				onChange={event => setInput(event.target.value)}
			/>
			<button onClick={handleSubmit}>
				Create
      </button>
		</div>
	)
}

const TodoItem = ({
	todo,
	todos,
	setTodos
}) => {
	const [checked, setChecked] = useState(todo.done)
	const handleChange = async event => {
		try {
			const response = await axios.put(
				`http://localhost:3001/todo/${todo.id}`,
				{
					done: !checked
				}
			)
			console.log(response)
			setChecked(!checked)
		} catch (error) {
			console.log(error)
		}
	}

	const handleDelete = async _ => {
		try {
			await axios
				.delete(`http://localhost:3001/todo/${todo.id}`)
			const newTodos = todos
				.filter(data => data.id !== todo.id)
			setTodos(newTodos)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div id='todoItem'>
			<div>{todo.text}</div>
			<input
				value={todo.text}
				type='checkbox'
				checked={checked}
				onChange={handleChange}
			/>
			<button onClick={handleDelete}>
				Delete
      </button>
		</div>
	)
}

export default App;