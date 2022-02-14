import { processTescoEmail } from './processor'
import EmailInput from '../../components/input/email'
import React, { useState } from 'react'
import { ctrlA } from './orderExample'
import styled from 'styled-components'

const FlexDiv = styled.div`
  margin: 5px;
  display: flex;
  background-color: gray;
  align-items: stretch;
`
const ListContainer = styled.div`
  background-color: azure;
  border: black solid 1px;
  margin: 5px;
  padding: 5px;
  flex-grow: 1;
`

const Button = styled.button`
  display: flex;
  margin: 2px;
  justify-items: center;
`

function List({ data }) {
  return (
    <ul>
      {data.map(d => (<li key={d.name}>{d.name}</li>))}
    </ul>
  )
}

export default function Tesco() {
  const [processed, setProcessed] = useState({ products: [], notAvailableProducts: [] })

  function handleLoadData(data) {
    if (!data) {
      console.log('no data')
      return
    }
    setProcessed(processTescoEmail({ email: data }))
  }

  return (
    <div>
      <FlexDiv>
        <h1>THIS IS TESCO</h1>
        <Button onClick={() => console.log(processed)}>LOG</Button>
      </FlexDiv>

      <EmailInput
        onDataLoad={handleLoadData}
        exampleData={ctrlA}
      />
      <FlexDiv>
        <ListContainer>
          <h3>Products:</h3>
          <List data={processed.products}/>
        </ListContainer>
        <ListContainer>
          <h3>Not Available Products:</h3>
          <List data={processed.notAvailableProducts}/>
        </ListContainer>
      </FlexDiv>
    </div>
  )
}
