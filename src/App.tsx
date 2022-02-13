import React from 'react'
import Kifli from './components/kifli'
import { ctrlA } from './components/kifli/test-kifl-order'

function App() {
  return (
        <Kifli
          orderConfirmEmail={ctrlA}
        ></Kifli>
  )
}


export default App
