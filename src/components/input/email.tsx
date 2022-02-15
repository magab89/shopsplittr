import React, { useState } from 'react'
import styled from 'styled-components'

const Styled = styled.div`
  display: flex;
  margin: 5px;
  background-color: lightblue;
`

const ButtonContainer = styled.div`
  display: flex;
  padding: 5px;
  flex-direction: column;
`

const Button = styled.button`
  display: flex;
  margin: 2px;
`

export default function EmailInput({
  onDataLoad,
  exampleData
}) {
  const [email, setEmail] = useState('')

  function handleLoadTest() {
    setEmail(exampleData)
    onDataLoad(exampleData)
  }

  function handleDelete() {
    setEmail('')
  }

  function handleChange(event) {
    setEmail(event.target.value)
  }

  return (<Styled>
      <textarea
        placeholder={'Copy your order here'}
        value={email}
        onChange={e => handleChange(e)}
        rows={5}
      />
      <ButtonContainer>
        <Button type="button" onClick={() => onDataLoad(email)}>LOAD ORDER EMAIL</Button>
        <Button type="button" onClick={() => handleDelete()}>DELETE ORDER EMAIL</Button>
        <Button type="button" onClick={() => handleLoadTest()}>LOAD TEST EMAIL</Button>
      </ButtonContainer>
    </Styled>
  )
}
