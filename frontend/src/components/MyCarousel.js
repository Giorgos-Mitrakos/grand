import Carousel from 'react-multi-carousel';
import CarouselCard from './CarouselCard';
import './CarouselCard.css'

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/components/navigation/navigation.min.css"
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
// import Swiper core and required modules
import SwiperCore, {
  Autoplay, Navigation
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Autoplay, Navigation]);

function CollectionCarousel({ carouselList, loading, error }) {

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
        <div>
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            slidesPerGroup={1}
            loop={true}
            loopFillGroupWithBlank={true}
            breakpoints={{
              "640": {
                "slidesPerView": 2,
                "spaceBetween": 20
              },
              "768": {
                "slidesPerView": 2,
                "spaceBetween": 20
              },
              "1024": {
                "slidesPerView": 4,
                "spaceBetween": 20
              }
            }}
            autoplay={{
              "delay": 4500,
              "disableOnInteraction": false
            }}
            navigation={true}
            className="mySwiper">
            {carouselList.map((col, index) =>
              <SwiperSlide key={index} className="carousel-card">
                <CarouselCard key={col._id} details={(col.category === 'Συλλογή') ? "/collection/" + col._id : "/product/" + col._id} src={col.image} alt={col.name} productName={col.name} price={col.totalPrice} />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
    // <Carousel
    //   className="carousel"
    //   responsive={responsive}
    //   additionalTransfrom={0}
    //   arrows
    //   autoPlay
    //   autoPlaySpeed={2500}
    //   centerMode={false}
    //   containerClass="container-with-dots"
    //   dotListClass=""
    //   draggable
    //   focusOnSelect={false}
    //   infinite
    //   itemClass=""
    //   keyBoardControl
    //   minimumTouchDrag={80}
    //   partialVisible={false}
    //   renderDotsOutside={false}
    //   showDots={false}
    //   sliderClass=""
    //   slidesToSlide={1}
    //   swipeable
    // >
    //   {carouselList.map(col => (
    //     <CarouselCard key={col._id} details={"/collection/" + col._id} src={col.image} alt={col.name} productName={col.name} price={col.totalPrice} />
    //   ))}
    // </Carousel>
  );

}

export default CollectionCarousel;