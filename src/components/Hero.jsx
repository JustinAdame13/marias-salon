const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-4">
      <div className="max-w-container-max mx-auto px-md grid md:grid-cols-2 gap-xl items-center">
        
        {/* Columna izquierda — texto */}
        <div>
          <h1 className="font-['Bodoni_Moda'] text-6xl md:text-8xl text-primary leading-none mb-md">
            Bienvenidos a{' '}
            <span className="italic font-light">
              Maria's Beauty Salon
            </span>
          </h1>

          <p className="font-body-md text-body-lg text-secondary max-w-prose mb-lg">
            Un espacio boutique donde la serenidad se encuentra 
            con la excelencia técnica. Redescubre tu estilo en 
            un entorno de calma y profesionalismo.
          </p>

          <div className="flex gap-md flex-wrap">
            <a
              href="#services"
              className="bg-primary text-on-primary px-lg py-sm rounded-sm font-label-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explorar Servicios
            </a>
            <a
              href="#about"
              className="border border-primary/20 text-primary px-lg py-sm rounded-sm font-label-md hover:bg-primary-container/10 transition-all"
            >
              Nuestra Historia
            </a>
          </div>
        </div>

        {/* Columna derecha — foto */}
        <div className="relative flex justify-end">
          <div className="w-full max-w-sm aspect-[4/5] relative bg-surface-container-high rounded-sm flex items-center justify-center">
            {/* 
              Cuando tengas la foto de Maria, reemplaza este div 
              por un <img> así:
              <img 
                src="/maria.jpg" 
                alt="Maria, estilista" 
                className="w-full h-full object-cover rounded-sm shadow-xl"
              />
            */}
            <p className="text-on-surface-variant font-body-md text-center px-md">
              📸 Foto de Maria<br/>
              <span className="text-sm opacity-60">(próximamente)</span>
            </p>
          </div>

          {/* Tarjeta de cita flotante */}
          <div className="absolute -bottom-8 -left-4 bg-surface-container-low p-lg border border-outline-variant/10 shadow-lg hidden md:block rounded-sm">
            <p className="font-headline-md text-xl italic text-primary">
              "Belleza es equilibrio."
            </p>
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-base">
              — Maria, Directora Creativa
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero