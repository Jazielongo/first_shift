window.onload = () => {
  const container = document.querySelector('.container');
  const containerWidth = container.offsetWidth;

  const capa1 = document.querySelector('.capa1');
  const capa2 = document.querySelector('.capa2');

  // Ancho de las capas
  const capa1Width = capa1.offsetWidth;
  const capa2Width = capa2.offsetWidth;

  gsap.fromTo(
    ".capa1, .capa2",
    { scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        gsap.fromTo(
          ".circle",
          { scale: 0.1 },
          {
            scale: 50,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              const circle = document.querySelector(".circle");
              Object.assign(circle.style, {
                width: "100vw",
                height: "100vh",
                borderRadius: "0",
                top: "0",
                left: "0",
                transform: "none"
              });

              // Calculamos desplazamiento
              const desplazamientoX = Math.min(containerWidth * 0.35, capa1Width * 0.6);

              // Rotación y separación
              gsap.to(".capa1", {
                rotation: 45,
                duration: 1,
                ease: "power3.out",
                onComplete: () => {
                  gsap.to(".capa1", {
                    x: desplazamientoX,
                    duration: 1,
                    ease: "power2.out"
                  });
                }
              });

              gsap.to(".capa2", {
                rotation: 45,
                duration: 1,
                ease: "power3.out",
                onComplete: () => {
                  gsap.to(".capa2", {
                    x: -desplazamientoX,
                    duration: 1,
                    ease: "power2.out"
                  });
                }
              });

              // Aparecer texto
              gsap.to(".texto-central", {
                opacity: 1,
                scale: 1,
                duration: 1,
                delay: 1.3,
                ease: "back.out(9)"
              });

              // Después de 3 s, empezamos la animación de salida
              setTimeout(() => {
                // Volver capas y texto
                gsap.to(".capa1", {
                  x: 0,
                  rotation: 0,
                  duration: 0.9,
                  ease: "power2.inOut"
                });
                gsap.to(".capa2", {
                  x: 0,
                  rotation: 0,
                  duration: 0.9,
                  ease: "power2.inOut"
                });
                gsap.to(".circle", {
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  duration: 1.5,
                  ease: "power2.inOut"
                });
                gsap.to(".texto-central", {
                  opacity: 0,
                  scale: 0.5,
                  duration: 0,
                  ease: "power1.inOut"
                });

                // 🕑 2 s después de terminar la salida, redirigir
                setTimeout(() => {
                  window.location.href = "/login";
                }, 2000);

              }, 3000); // espera 3 s antes de iniciar la salida
            }
          }
        );
      }
    }
  );
};
