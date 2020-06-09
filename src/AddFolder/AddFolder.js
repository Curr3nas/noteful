import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'
import ErrorPage from '../Errors/ErrorPage'
import ValidationError from '../Errors/ValidationError'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: { value: '', touched: false },

    }
  }
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: this.state.name.value
    }
    fetch(`https://noteful-backend-douglas.herokuapp.com/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  updateName(name) {
    this.setState({name: {value: name, touched: true}})
  }

  validateName() {
    const name = this.state.name.value.trim();
    if(name.length === 0) {
      return 'Name is required';
    } else if(name.length < 3) {
      return 'Name should be at least 3 characters long'
    }
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <ErrorPage>
          <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' onChange={e => this.updateName(e.target.value)}/>
            {this.state.name.touched && <ValidationError message={this.validateName()} /> }
          </div>
          <div className='buttons'>
            <button 
            type='submit'
            className="folder-submit"
            disabled={
              this.validateName()
            }
            >
              Add folder
            </button>
          </div>
        </NotefulForm>
        </ErrorPage>
        
      </section>
    )
  }
}
