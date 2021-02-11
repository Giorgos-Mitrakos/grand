import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-multi-carousel';
import './CollectionCarousel.css';
import "react-multi-carousel/lib/styles.css";
import { findMostViewedProducts } from '../action/productActions';
import { Fragment } from 'react';
import CarouselCard from './CarouselCard';

function MostViewProductsCarousel (){

  const mostViewedProducts= useSelector(state=>state.mostViewedProducts);
  const {mostViewed,loading,error}=mostViewedProducts;
  const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(findMostViewedProducts());
        
        return ()=>{

        };
    },[dispatch])

  const responsive = {
    superXLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1800 },
      items: 5
    },
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 1800, min: 1300 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1300, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 740 },
      items: 2
    },
    largeMobile: {
      breakpoint: { max: 740, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
   
    return(
      loading? <div>Loading...</div>:
      error?<div>{error}</div>:
      <Fragment>
      <h2>ΔΗΜΟΦΙΛΕΣΤΕΡΑ ΠΡΟΙΟΝΤΑ</h2>
      <Carousel 
      className="carousel"
      responsive={responsive}
      additionalTransfrom={0}
      arrows
      autoPlay
      autoPlaySpeed={3000}
      centerMode={false}
      containerClass="container-with-dots"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      partialVisible={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
      >
        {mostViewed.map(product=>(
          <CarouselCard key={product._id} details={"/product/"+product._id} src={product.image} alt={product.name} productName={product.name} price={product.totalPrice}/>
        ))}
      </Carousel>
      </Fragment>
    );

}

export default MostViewProductsCarousel;