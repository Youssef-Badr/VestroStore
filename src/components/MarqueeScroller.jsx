import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductCard from "./../components/ProductCard";

const MarqueeScroller = React.memo(({ products, direction = "left", darkMode }) => {

  // نكرر مرتين فقط (مش 3)
  const scrollItems = [...products, ...products];

  return (
    <div className="w-full overflow-hidden relative py-8" dir="ltr">

      {/* gradients */}
      <div className={`absolute inset-y-0 left-0 w-20 z-10 pointer-events-none bg-gradient-to-r ${
        darkMode ? "from-black" : "from-white"
      } to-transparent`} />

      <div className={`absolute inset-y-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l ${
        darkMode ? "from-black" : "from-white"
      } to-transparent`} />

      <motion.div
        className="flex w-max gap-6"
        animate={{
          x: direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {scrollItems.map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="w-64 md:w-72 flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>

    </div>
  );
});

export default MarqueeScroller;