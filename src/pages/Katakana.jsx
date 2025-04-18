import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { motion, useSpring, useScroll } from "framer-motion";

function Katakana() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div className="h-screen bg-[url(@/assets/katakana-bg.jpg)] bg-cover">
      <Header />

      <motion.div
        id="scroll-indicator"
        style={{
          scaleX,
          position: "fixed",
          top: 90,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "#EBAAC1",
        }}
      />

      <h1 className="px-6 mt-2 text-2xl font-bold text-center font-body">
        Катакана
      </h1>
    </motion.div>
  );
}

export default Katakana;
