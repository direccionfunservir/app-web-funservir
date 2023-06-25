import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TextLink from 'components/UI/TextLink/TextLink';
import Rating from 'components/UI/Rating/Rating';
import Favourite from 'components/UI/Favorite/Favorite';
import Carousel from 'react-multi-carousel'; // Documentación: https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import GridCard from '../GridCard/GridCard';

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 1,
    paritialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

const PostGrid = ({
  name,
  rating,
  siteAddress,
  price,
  ratingCount,
  gallery,
  slug,
  link,
  inclusiveElements
}) => {
  return (
    <GridCard
      isCarousel={true}
      // favorite={
      //   <Favourite
      //     onClick={(event) => {
      //       console.log(event);
      //     }}
      //   />
      // }
      location={siteAddress}
      inclusiveElements={inclusiveElements}
      title={<TextLink link={`${link}/${slug}`} content={name} />}
      price={`$${price}/Night - Free Cancellation`}
      rating={<Rating rating={rating} ratingCount={ratingCount} type="bulk" />}
      viewDetailsBtn={
        <TextLink
          link={`/post/${slug}`}
          icon={<FiExternalLink />}
          content="Ver detalles"
        />
      }
    >
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        renderDotsOutside={false}
        responsive={responsive}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
      >
        {(gallery)?gallery.map(({ secure_url, title }, index) => (
          <img
            src={secure_url}
            alt={title}
            key={index}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'relative',
            }}
          />
        )):[]}
      </Carousel>
    </GridCard>
  );
};

export default PostGrid;
