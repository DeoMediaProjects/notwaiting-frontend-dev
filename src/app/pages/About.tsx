import { Link } from 'react-router';
import { Button } from '../components/Button';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">
            About #NotWaiting
          </h1>

          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-2xl font-black">
              We are a movement of African builders, creators, and innovators who refuse to wait for permission to build the future.
            </p>

            <p>
              #NotWaiting is more than a hashtag. It's a declaration. A commitment. A movement of people across the continent and the diaspora who are actively building, creating, and innovating — right now.
            </p>

            <div className="border-l-4 border-[#dd3935] pl-6 py-4 my-12">
              <h2 className="text-3xl font-black uppercase mb-4">Our Mission</h2>
              <p>
                To amplify, connect, and celebrate the wave of innovation emerging from Africa — and to create a visible, undeniable proof that Africa is not waiting.
              </p>
            </div>

            <h2 className="text-3xl font-black uppercase mt-16 mb-6">What We Believe</h2>

            <div className="space-y-6">
              <div className="bg-[#F5F5F5] p-6 border-l-4 border-[#0C0C0A]">
                <h3 className="text-xl font-black uppercase mb-2">Africa is already moving</h3>
                <p>Innovation isn't coming to Africa. It's already here, being built by people who see problems as opportunities.</p>
              </div>

              <div className="bg-[#F5F5F5] p-6 border-l-4 border-[#0C0C0A]">
                <h3 className="text-xl font-black uppercase mb-2">We build in public</h3>
                <p>Transparency accelerates progress. When we share what we're building, we inspire others and create opportunities for collaboration.</p>
              </div>

              <div className="bg-[#F5F5F5] p-6 border-l-4 border-[#0C0C0A]">
                <h3 className="text-xl font-black uppercase mb-2">We lift as we climb</h3>
                <p>Success isn't a zero-sum game. Every builder who rises creates space for others to follow.</p>
              </div>

              <div className="bg-[#F5F5F5] p-6 border-l-4 border-[#0C0C0A]">
                <h3 className="text-xl font-black uppercase mb-2">We are not waiting</h3>
                <p>Not for funding. Not for infrastructure. Not for permission. We build with what we have, where we are, starting now.</p>
              </div>
            </div>

            <h2 className="text-3xl font-black uppercase mt-16 mb-6">Who This Is For</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-black mb-3">🔨 Builders</h3>
                <p>Founders, developers, engineers creating products and platforms that solve real problems.</p>
              </div>
              <div>
                <h3 className="text-xl font-black mb-3">🎨 Creators</h3>
                <p>Artists, musicians, designers, writers shaping culture and exporting creativity globally.</p>
              </div>
              <div>
                <h3 className="text-xl font-black mb-3">💡 Innovators</h3>
                <p>Scientists, researchers, educators advancing knowledge and pushing boundaries.</p>
              </div>
              <div>
                <h3 className="text-xl font-black mb-3">🌍 Supporters</h3>
                <p>Anyone who believes in the power of African innovation and wants to be part of this wave.</p>
              </div>
            </div>

            <div className="bg-[#0C0C0A] text-white p-12 text-center mt-16">
              <h2 className="text-4xl font-black uppercase mb-6">Join the movement</h2>
              <p className="text-xl mb-8">Add your name to the manifesto and become part of the movement.</p>
              <Link to="/">
                <Button className="text-lg px-12 py-5">
                  Sign the Manifesto →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
