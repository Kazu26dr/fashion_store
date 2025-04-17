import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import NoImage from "../../assets/img/src/no_image.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageSwiper = (props: { images: string[] }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={true}
      pagination={{ 
        clickable: true,
        el: '.swiper-pagination',
      }}
      loop={true}
      spaceBetween={30}
      slidesPerView={1}
      allowSlideNext={true}
      allowSlidePrev={true}
      simulateTouch={true}
      className="custom-swiper"
    >
      <div className="swiper-pagination" style={{ position: 'absolute', top: '30px', bottom: 'auto', zIndex: 10 }}></div>
      
      {props.images.length === 0 ? (
        <SwiperSlide>
          <div
            className="p-media__thumb"
            style={{
              height: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={NoImage}
              alt="No Image"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </SwiperSlide>
      ) : (
        props.images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="p-media__thumb"
              style={{
                height: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={image}
                alt={`商品画像 ${index + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  );
};

export default ImageSwiper;
