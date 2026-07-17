import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useProducts } from '../hooks/useProducts';
import { HERO_SLIDES, CATEGORIES, BRANDS, TESTIMONIALS } from '../constants';
import { formatPrice } from '../utils/formatters';

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: easeOut },
  }),
};

export const Home = () => {
  const { data: products } = useProducts();
  const featured = products?.slice(0, 8) || [];
  const trending = products?.slice(0, 4) || [];

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative h-dvh min-h-[600px] max-h-[1000px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.hero-pagination' }}
          className="h-full"
        >
          {HERO_SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-[#050505]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="relative h-full flex items-center section-padding">
                  <div className="max-w-3xl">
                    <motion.span
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase text-accent mb-5"
                    >
                      {slide.tag}
                    </motion.span>
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="heading-xl mb-4"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="subtitle max-w-xl mb-8"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4"
                    >
                      <Link to="/products" className="btn-primary text-sm sm:text-base">
                        Shop Now <ArrowRight size={16} />
                      </Link>
                      <Link to="/products" className="btn-secondary text-sm sm:text-base">
                        Explore Collection
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3 hero-pagination" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 z-10 hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.15em] uppercase text-text-tertiary">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-text-tertiary to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="section-padding py-28 md:py-36">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="section-label">Categories</span>
            <h2 className="heading-lg mt-3">Explore by category</h2>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors group"
          >
            View All
            <span className="group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true, margin: '-50px' }}
                className="group relative h-72 md:h-96 overflow-hidden rounded-2xl surface cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="img-cover group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold tracking-tight">{cat.name}</h3>
                  <p className="text-xs text-text-secondary/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {cat.count}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured ─── */}
      {featured.length > 0 && (
        <section className="section-padding py-28 md:py-36">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="section-label">Featured</span>
              <h2 className="heading-lg mt-3">Curated for you</h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors group"
            >
              View All
              <span className="group-hover:translate-x-0.5 transition-transform">
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-6 px-6">
            <div className="flex gap-5 pb-4" style={{ minWidth: 'max-content' }}>
              {featured.map((product, i) => (
                <Link key={product._id} to={`/products/${product._id}`}>
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    custom={i}
                    viewport={{ once: true }}
                    className="group w-80 md:w-96"
                  >
                    <div className="relative h-96 md:h-[440px] overflow-hidden rounded-2xl surface">
                      <img
                        src={product.imagesUrl}
                        alt={product.name}
                        className="img-cover group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {product.stock <= 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase bg-error/15 text-error rounded-full border border-error/20">
                          Out of Stock
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-xs text-text-secondary/80">{product.category}</span>
                        <h3 className="text-base font-medium mt-1">{product.name}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            {product.rating || 'New'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 px-1">
                      <p className="text-xs text-text-tertiary tracking-wider uppercase">{product.category}</p>
                      <h3 className="text-base font-medium mt-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-semibold">{formatPrice(product.price)}</span>
                        <span className="flex items-center gap-1 text-xs text-text-secondary">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          {product.rating || 'New'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Premium Banner ─── */}
      <section className="section-padding py-28 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=85"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          </div>
          <div className="relative px-8 md:px-16 py-16 md:py-24">
            <span className="section-label text-accent">Premium</span>
            <h2 className="heading-xl mt-4 max-w-2xl leading-[0.85]">
              Built for
              <br />
              <span className="text-accent-gradient">Professionals.</span>
            </h2>
            <p className="subtitle mt-6 max-w-md">
              High-performance devices engineered for creators, developers, and power users who demand the best.
            </p>
            <Link to="/products?category=Laptops" className="btn-primary mt-8">
              Discover More <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Trending ─── */}
      {trending.length > 0 && (
        <section className="section-padding py-28 md:py-36">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="section-label">Trending</span>
              <h2 className="heading-lg mt-3">Most wanted</h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors group"
            >
              View All
              <span className="group-hover:translate-x-0.5 transition-transform">
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {trending.map((product, i) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  viewport={{ once: true }}
                  className="group card"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={product.imagesUrl}
                      alt={product.name}
                      className="img-cover group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-xs text-text-tertiary tracking-wider uppercase">{product.category}</p>
                    <h3 className="text-base font-medium mt-1.5">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
                      <span className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                        <ArrowRight size={14} className="text-text-secondary" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Stats / Brands ─── */}
      <section className="section-padding py-28 md:py-36 border-t border-white/[0.04]">
        <div className="text-center mb-16">
          <span className="section-label">Trusted Partners</span>
          <h2 className="heading-lg mt-3">Leading brands</h2>
        </div>

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-45%'] }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="flex gap-16 md:gap-24 items-center"
            style={{ width: 'max-content' }}
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-8 md:h-10 flex items-center opacity-[0.15] hover:opacity-[0.35] transition-opacity duration-500"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full max-w-[140px] object-contain brightness-0 invert"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { label: 'Products', value: '10,000+' },
            { label: 'Customers', value: '50,000+' },
            { label: 'Brands', value: '200+' },
            { label: 'Delivery', value: '2-3 Days' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-text-tertiary mt-1 tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section-padding py-28 md:py-36">
        <div className="text-center mb-16">
          <span className="section-label">Testimonials</span>
          <h2 className="heading-lg mt-3">Trusted by thousands</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
              className="card p-6 md:p-8"
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm md:text-base text-text-secondary/90 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.06]"
                />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-text-tertiary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="section-padding py-28 md:py-36 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto text-center"
        >
          <span className="section-label">Stay Connected</span>
          <h2 className="heading-lg mt-3 mb-4">Stay ahead of the curve</h2>
          <p className="subtitle mb-8">
            Get early access to new launches, exclusive offers, and tech insights.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).querySelector('input');
              if (input?.value) input.value = '';
            }}
            className="flex gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-premium flex-1"
            />
            <button
              type="submit"
              className="btn-primary flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};
