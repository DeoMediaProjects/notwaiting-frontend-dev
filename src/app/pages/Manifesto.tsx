import { Link } from 'react-router';
import { Button } from '../components/Button';
import waveImage from '../../imports/maker.png';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* Mobile layout — stacked, no absolute positioning */}
      <section className="md:hidden px-6 py-16">
        <div className="max-w-lg mx-auto space-y-8 text-center">
          <h1 className="text-3xl font-black leading-tight text-[#0C0C0A]">
            Opportunity Africa<br />Manifesto
          </h1>
          <img
            src={waveImage}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain mx-auto max-w-xs"
          />
          <div className="space-y-4 text-sm leading-relaxed text-[#0C0C0A] text-left">
            <p>"I believe in my country and I believe in Africa.</p>
            <p>I believe in the people, places, ideas, and bold actions moving this continent forward every day.</p>
            <p>By signing this manifesto and joining the Opportunity Africa wave, I commit to using my voice, my work, and my platforms to show the progress we are making.</p>
            <p>I will spotlight what is working and make visible the Africa that we often ignore.</p>
            <p>Because what we see, we believe in. What we believe in, we back. What we back, we build.</p>
            <p>I want to be part of the change.</p>
          </div>
          <p className="font-black text-lg text-[#0C0C0A]">"I am #NotWaiting."</p>
          <Link to="/">
            <Button className="bg-[#DD3935] hover:bg-[#C92F2B] text-white px-8 py-3 rounded-full font-black uppercase">
              Join the movement →
            </Button>
          </Link>
        </div>
      </section>

      {/* Desktop layout — image with absolute-positioned text overlay */}
      <section className="hidden md:block px-6 pt-0 pb-24">
        <div className="max-w-[1180px] mx-auto">
          <div className="relative w-full -mt-6 md:-mt-10">
            <img
              src={waveImage}
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain"
            />

            {/* HEADING */}
            <div className="absolute top-[21%] right-[16%] w-[36%] text-center px-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-[0.9] text-[#0C0C0A]">
                Opportunity
                <br />
                Africa Manifesto
              </h1>
            </div>

            {/* BODY COPY */}
            <div className="absolute top-[30%] right-[24%] w-[34%] text-center px-2">
              <div className="space-y-3 text-[10px] md:text-xs lg:text-sm leading-tight text-[#0C0C0A]">
                <p>"I believe in my country and I believe in Africa.</p>
                <p>I believe in the people, places, ideas, and bold actions moving this continent forward every day.</p>
                <p>By signing this manifesto and joining the Opportunity Africa wave, I commit to using my voice, my work, and my platforms to show the progress we are making.</p>
                <p>I will spotlight what is working and make visible the Africa that we often ignore.</p>
                <p>Because what we see, we believe in. What we believe in, we back. What we back, we build.</p>
                <p>I want to be part of the change.</p>
              </div>
            </div>

            {/* NOT WAITING STATEMENT */}
            <div className="absolute top-[57%] right-[20%] w-[28%] text-center">
              <p className="font-black text-sm md:text-base lg:text-xl text-[#0C0C0A]">
                "I am #NotWaiting."
              </p>
            </div>

            {/* CTA Button */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5%] z-20">
              <Link to="/">
                <Button className="bg-[#DD3935] hover:bg-[#C92F2B] text-white text-sm md:text-base px-8 py-3 rounded-full font-black uppercase">
                  Join the movement →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
