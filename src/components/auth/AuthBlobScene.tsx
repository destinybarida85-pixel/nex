function Blob({
  size,
  top,
  left,
  gradient,
  delay = "0s",
  duration = "8s",
  z = 0,
}: {
  size: number;
  top: string;
  left: string;
  gradient: string;
  delay?: string;
  duration?: string;
  z?: number;
}) {
  return (
    <div
      className="nx-auth-blob absolute"
      style={
        {
          width: size,
          height: size,
          top,
          left,
          borderRadius: "42% 58% 62% 38% / 45% 40% 60% 55%",
          background: gradient,
          boxShadow: "0 30px 60px -20px rgba(80, 30, 90, 0.35)",
          animationDelay: delay,
          animationDuration: duration,
          zIndex: z,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute rounded-full"
        style={{
          width: "38%",
          height: "38%",
          top: "14%",
          left: "18%",
          background: "radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

export default function AuthBlobScene() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf1ec 0%, #f3eefb 55%, #eaf0fb 100%)" }}
    >
      <div className="absolute inset-0" style={{ perspective: 900 }}>
        <Blob
          size={230}
          top="18%"
          left="22%"
          gradient="radial-gradient(circle at 32% 28%, #ffb199, #ff6a88 55%, #a35bd9 100%)"
          duration="9s"
          z={3}
        />
        <Blob
          size={140}
          top="8%"
          left="58%"
          gradient="radial-gradient(circle at 35% 30%, #ffe29a, #ffb15c 60%, #ff8a5c 100%)"
          delay="1.2s"
          duration="7.5s"
          z={2}
        />
        <Blob
          size={110}
          top="58%"
          left="10%"
          gradient="radial-gradient(circle at 30% 30%, #b7c6ff, #7c8cf8 60%, #6a5cd9 100%)"
          delay="0.6s"
          duration="10s"
          z={2}
        />
        <Blob
          size={175}
          top="52%"
          left="46%"
          gradient="radial-gradient(circle at 32% 28%, #d9b7ff, #9c7cf0 55%, #6a4fd9 100%)"
          delay="1.8s"
          duration="8.5s"
          z={4}
        />
        <Blob
          size={72}
          top="34%"
          left="66%"
          gradient="radial-gradient(circle at 30% 30%, #fff2d9, #ffcf8a 60%, #ffab5c 100%)"
          delay="0.3s"
          duration="6.5s"
          z={5}
        />
      </div>
    </div>
  );
}
