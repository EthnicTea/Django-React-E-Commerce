import'./App.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Items } from './components/Items.jsx'
import { Foot } from './components/Foot.jsx'
export function App (){
  return (
    <article>
      <header>
        <Navbar />
        <Hero />
      </header>
      <body>
        <div className='items-container'>
          <Items />
          <Items />
          <Items />
          <Items />
        </div>
      </body>
      <footer>
        <Foot />
      </footer>
    </article>
  )
}
