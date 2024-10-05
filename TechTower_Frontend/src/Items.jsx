import './App.css'
export function Items (){
    return (
      <article className='it-itemCard'>
        <div className='it-itemCard-conteiner'>
          <img className='it-itemCard-img'
          alt="itemimg"
          src={'https://http2.mlstatic.com/D_NQ_NP_886283-MLA45376500703_032021-O.webp'}
          />
          <div className='it-itemCard-info'>
            <strong className='it-itemCard-infoName'>Procesador Intel Core i5-7600nose</strong>
          </div>
        </div>
      </article>
    )
  }