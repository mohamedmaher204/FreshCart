import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function loading() {
  return <>

  <div  className='h-screen flex justify-center items-center bg-amber-50'>
    (<RotatingLines
        visible={true}
        height="96"
        width="96"
        color="grey"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
/>)
    

  </div>
  
  
  
  </>
}

// render(<RotatingLines
// visible={true}
// height="96"
// width="96"
// color="grey"
// strokeWidth="5"
// animationDuration="0.75"
// ariaLabel="rotating-lines-loading"
// wrapperStyle={{}}
// wrapperClass=""
// />)
