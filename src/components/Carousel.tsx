import { useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import styles from './Carousel.module.scss';

interface CarouselProps {
  title?: string;
  items: Movie[];
}

const CarouselItem = ({ item }: { item: Movie }) => (
  <div className={styles.card}>
    <Link to={`/movie/${item.id}`} className={styles.link}>
      {item.posterUrl ? (
        <>
          <img 
            src={item.posterUrl} 
            alt={item.title} 
            className={styles.poster}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.caption}>{item.title}</span>
        </>
      ) : (
        <span>{item.title}</span>
      )}
    </Link>
  </div>
);

const Carousel = ({ title, items }: CarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = useCallback((amount: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const memoizedItems = useMemo(() => items, [items]);

  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.wrap}>
        <button 
          aria-label="Previous" 
          onClick={() => scrollByAmount(-200)} 
          className={`${styles.arrow} ${styles.prev}`}
        >
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div ref={trackRef} className={styles.track}>
          {memoizedItems.map((item) => (
            <CarouselItem key={item.id} item={item} />
          ))}
        </div>
        <button 
          aria-label="Next" 
          onClick={() => scrollByAmount(200)} 
          className={`${styles.arrow} ${styles.next}`}
        >
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Carousel;


