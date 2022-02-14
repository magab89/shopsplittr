import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Styled = styled.div`
  a {
    text-decoration: none;
    display: block;
    padding: 1em;
    margin: 2px;
    color: white;
    background: #3456b5;
    max-width: 10em;
  }
`

export default function Home() {
  return (
    <Styled>
      <h1>THIS IS HOME</h1>
      <Link to="/kifli">Kifli</Link>
      <Link to="/tesco">Tesco</Link>
      <p>1. Choose store</p>
      <p>2. Copy and paste the confirmation email to the input field.</p>
      <p>You can select the all the text of gmail with ctrl-a.</p>
    </Styled>
  )
}
