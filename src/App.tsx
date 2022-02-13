import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom: 1rem;
  background: #223773;
  
  a {
    text-decoration: none;
    display: block;
    padding: 1em;
    margin: 2px;
    color: white;
    background: #3456b5
  }
`

export function Home () {
  return (
    <div>
      <h1>
        THIS IS HOME
      </h1>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>This is ShopSplittR</h1>
      <StyledNav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/kifli">Kifli</Link>
        <Link to="/tesco">Tesco</Link>
      </StyledNav>
      <Outlet/>
    </div>
  )
}

export default App
