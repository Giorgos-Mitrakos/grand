import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-multi-carousel';
import './CollectionCarousel.css';
import "react-multi-carousel/lib/styles.css";
import { listCollection } from '../action/collectionActions';
import { Fragment } from 'react';
import CarouselCard from './CarouselCard';

function CollectionCarousel() {

  const collectionList = useSelector(state => state.collectionList);
  const { collection, loading, error } = collectionList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listCollection());

    return () => {

    };
  }, [dispatch])

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

  return (
    loading ? <div>Loading...</div> :
      error ? <div>{error}</div> :
        <Fragment>
          <h2>Η ΣΥΛΛΟΓΗ ΜΑΣ</h2>
          <Carousel
            className="carousel"
            responsive={responsive}
            additionalTransfrom={0}
            arrows
            autoPlay
            autoPlaySpeed={2500}
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
            renderDotsOutside={false}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {collection.map(col => (
              <CarouselCard key={col._id} details={"/collection/" + col._id} src={col.image} alt={col.name} productName={col.name} price={col.totalPrice} />
            ))}
          </Carousel>
        </Fragment>
  );

}

export default CollectionCarousel;