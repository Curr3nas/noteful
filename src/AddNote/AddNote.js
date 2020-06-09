import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import ErrorPage from '../Errors/ErrorPage'
import ValidationError from '../Errors/ValidationError'

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      },
      content: {
        value: '',
        touched: false
      },
      folderId: {
        value: '',
        thouched: false
      }
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
    
    const { name, content, folderId } = this.state
    
    const newNote = {
      name: name.value,
      content: content.value,
      folderId: folderId.value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  updateNoteName(name) {
    this.setState({name: {value: name, touched: true}})
  }

  updateContent(content) {
    this.setState({content: {value: content, touched: true}})
  }

  updateFolderId(folderId) {
    this.setState({folderId: {value: folderId, touched: true}})
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return 'Content is required';
    }
  }

  validateFolderId() {
    const folderId = this.state.folderId.value;
    if (folderId === '' || folderId === '...' || !folderId) {
      return 'Please select a folder';
    }
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <ErrorPage>
          <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateNoteName(e.target.value)}/>
            {this.state.name.touched && <ValidationError message={this.validateName()} />}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateContent(e.target.value)}/>
            {this.state.content.touched && <ValidationError message={this.validateContent()} />}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolderId(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            {this.state.folderId.touched && <ValidationError message={this.validateFolderId()} />}
          </div>
          <div className='buttons'>
            <button 
            type='submit'
            className='note-submit'
            disabled={
              this.validateName() ||
              this.validateFolderId() ||
              this.validateContent()
            }
            >
              Add note
            </button>
          </div>
        </NotefulForm>
        </ErrorPage>
      </section>
    )
  }
}
