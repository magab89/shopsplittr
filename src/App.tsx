import React, { useState } from 'react'
import Kifli from './components/kifli'
import { ctrlA } from './components/kifli/test-kifl-order'

function App() {

  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  function handleLoadData(e) {
    if (email) setReady(true)
  }

  function handleDelete(e) {
    setReady(false)
    setEmail('')
  }

  function handleChange(event) {
    setEmail(event.target.value)
  }

  return (
    <>
      <textarea
        value={email}
        onChange={e => handleChange(e)}
        rows={10}
      />
      <button type="button" onClick={(e) => handleLoadData(e)}>LOAD ORDER EMAIL</button>
      <button type="button" onClick={(e) => handleDelete(e)}>DELETE ORDER EMAIL</button>
      {ready && email && <Kifli
        orderConfirmEmail={email}
      />}
    </>
  )
}


export default App
