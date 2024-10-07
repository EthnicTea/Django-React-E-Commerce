import'./App.css'
import { Navbar } from './Navbar/Navbar.jsx'
import { Items } from './Items/Items.jsx'
import { Foot } from './Footer/Foot.jsx'
export function App (){
  return (
    <article>
      <header>
        <Navbar />
      </header>
      <body>
        <Items />
      </body>
      <footer>
        <Foot />
      </footer>
    </article>
  )
}
