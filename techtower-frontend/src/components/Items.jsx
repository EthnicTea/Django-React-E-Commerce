import './Items.css';

export function Items() {
  return (
    <article className='it-itemCard'>
      <div className='it-itemCard-container'>
        <img 
          className='it-itemCard-img'
          alt="itemimg"
          src={'https://http2.mlstatic.com/D_NQ_NP_886283-MLA45376500703_032021-O.webp'}
        />
        <div className='it-itemCard-info'>
          <p className='it-itemCard-infoManufactur'>Intel</p>
          <p className='it-itemCard-infoName'>Procesador Intel Core i5-7600</p>
          <p className='it-itemCard-infoDiscount'>
            <span className='it-itemCard-infoDiscount-price'></span>
          </p>
          <p className='it-itemCard-infoPrice'>$170.000&nbsp;
            <span className='it-itemCard-infoPrice-span'>Transferencia</span>
          </p>
          <p className='it-itemCard-infoPrice-regular'>$210.000&nbsp; 
            <span className='it-itemCard-infoPrice-regular-span'>Otros medios de pago</span>
          </p>
        </div>
      </div>
    </article>
  );
}
