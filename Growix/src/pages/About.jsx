export default function About(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* About Us Title Section with Background Image */}
      <div className="relative mb-16">
        <div className="bg-white rounded-2xl p-12 text-center  relative overflow-hidden">
          {/* Background Image */}
          <div 
          className="absolute inset-0 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{backgroundImage: 'url(/about-logo.png)'}}
        ></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-6xl md:text-5xl font-bold text-black font-poppins mb-8">About Us</h1>
          </div>
        </div>
      </div>

      {/* Introductory Statement */}
      <div className="mb-16">
        <div className="bg-gray-100 rounded-2xl p-8 text-center max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl text-black font-poppins font-bold">
            One platform for dancers and organizers to <br /><span className="text-orange-400 font-bold">learn</span> and <span className="text-pink-600 font-bold">share.</span>
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mb-8">
        <div className="grid md:grid-cols-[1fr_auto] items-center">
          <div className="bg-gray-100 rounded-2xl p-4 mr-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black font-poppins mb-6 text-center">Mission</h2>
            <p className="text-lg text-black font-inter leading-relaxed text-center">
              Our mission is to unite dancers and workshop organizers of all styles in one place, making it easy to discover, join, and share open classes and workshops, so they can learn from each other, grow together, and find their path in dance.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <span className="text-9xl md:text-[12rem] font-bold text-black font-poppins">01</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-8">
        <div className="grid md:grid-cols-[auto_1fr] items-center">
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <span className="text-9xl md:text-[12rem] font-bold text-orange-400 font-poppins">02</span>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 order-1 md:order-2 ml-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black font-poppins mb-6 text-center">Benefits</h2>
            <ul className="text-lg text-black font-inter leading-relaxed space-y-3 text-center">
              <li className="flex items-start text-black ml-6">
                <span className="text-black mr-3">•</span>
                All workshops and open classes in one place
              </li>
              <li className="flex items-start text-black ml-6">
                <span className="text-black mr-3">•</span>
                Designed for dance community
              </li>
              <li className="flex items-start text-black ml-6">
                <span className="text-black mr-3">•</span>
                Your tool for self-improvement
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-8">
        <div className="grid md:grid-cols-[1fr_auto] items-center">
          <div className="bg-gray-100 rounded-2xl p-4 mr-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black font-poppins mb-6 text-center">Our Values</h2>
            <p className="text-lg text-black font-inter leading-relaxed text-center">
              <span className="text-pink-600 font-bold">Growth.</span> We value the desire to improve and step out of your comfort zone, supporting every step toward your goals.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <span className="text-9xl md:text-[12rem] font-bold text-pink-600 font-poppins">03</span>
          </div>
        </div>
      </div>
    </div>
  )
}


