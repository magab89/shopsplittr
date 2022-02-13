import React, { useState } from 'react'
import Kifli from './routes/kifli'
import { ctrlA } from './routes/kifli/test-kifl-order'
import { Link, Outlet } from 'react-router-dom'

export function Test () {
  return (
    <div>
      <h1>THIS IS A TEST PAGE</h1>
    </div>
  )
}

export function InputAreaKifli () {
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  function handleLoadData(e) {
    if (email) setReady(true)
  }

  function handleLoadTest(e) {
    setEmail(ctrlA)
    setReady(true)
  }

  function handleDelete(e) {
    setReady(false)
    setEmail('')
  }

  function handleChange(event) {
    setEmail(event.target.value)
  }

  return (<>
      <textarea
        value={email}
        onChange={e => handleChange(e)}
        rows={10}
      />
    <button type="button" onClick={(e) => handleLoadData(e)}>LOAD ORDER EMAIL</button>
    <button type="button" onClick={(e) => handleDelete(e)}>DELETE ORDER EMAIL</button>
    <button type="button" onClick={(e) => handleLoadTest(e)}>LOAD TEST EMAIL</button>
    {ready && email && <Kifli
      orderConfirmEmail={email}
    />}
  </>)
}

function App() {
  return (
    <div className="App">
      <h1>This is ShopSplittR</h1>
      <nav style={{
        borderBottom: "solid 1px",
        paddingBottom: "1rem",
        marginBottom: "1rem"
      }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/test">Test</Link>
      </nav>
      <Outlet/>
    </div>
  )
}

export default App
