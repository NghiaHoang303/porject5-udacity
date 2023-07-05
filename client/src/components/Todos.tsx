import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  // Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import './styles.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    const notify = () => toast.success('🎉 Create Todo Success 🎉', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      await notify();
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }
  onTodoDelete = async (todoId: string) => {
    const notify = () => toast.success('🦄 Delete Success', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    console.log("aaaa")
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId);
      await notify();
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId)
      })
      
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    console.log('pos: ', pos)
    const notify = () => toast.success('🎉 congratulation 🎉', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    try {
      const todo = this.state.todos[pos]
      console.log('todo: ', !todo.done)
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      await notify()
      console.log('here1')
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
      console.log('here2')
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" style={{ color: 'white' }}>
          TODOs
        </Header>
        {this.renderCreateTodoInput()}
        {/* {this.searchTodoItem()} */}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }
    console.log('get data')

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid key={todo.todoId} id="displayTodo">
              <div
                className="card cardBeauty"
                style={{
                  backgroundColor: todo.done ? '#85FFBD' : 'white',
                  backgroundImage: todo.done
                    ? 'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)'
                    : '',
                  borderRadius: '3%',
                  height: '250px'
                }}
              >
                {todo.attachmentUrl && (
                  <>
                    <img
                      src={todo.attachmentUrl}
                      alt="images"
                      id="imageItem"
                      style={{ height: '120px' }}
                    />
                  </>
                )}
                <div className="card-body">
                  <h5 className="card-title">{todo.dueDate}</h5>
                  <div className="card-text">
                    <Checkbox
                      onChange={() => this.onTodoCheck(pos)}
                      checked={todo.done}
                      style={{ marginRight: '10px' }}
                    />
                    {todo.name}
                  <ToastContainer />

                  </div>
                  {/* <a href="#" className="btn btn-primary"></a> */}
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(todo.todoId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onTodoDelete(todo.todoId)}
                  >
                    <Icon name="delete" />
                  </Button>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  {/* Same as */}
                  <ToastContainer />
                </div>
              </div>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
