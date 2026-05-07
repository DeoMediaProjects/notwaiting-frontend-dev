import { Button } from '../components/Button';

const partners = [
  {
    name: 'African Tech Foundation',
    type: 'Foundation',
    description: 'Supporting tech innovation across the continent with grants, mentorship, and infrastructure.'
  },
  {
    name: 'Pan-African Innovation Network',
    type: 'Network',
    description: 'Connecting innovators across 54 countries to collaborate, share resources, and amplify impact.'
  },
  {
    name: 'Future of Work Initiative',
    type: 'Initiative',
    description: 'Preparing African talent for the global digital economy through skills training and job placement.'
  },
  {
    name: 'Climate Solutions Africa',
    type: 'Organization',
    description: 'Funding and accelerating climate tech startups solving Africa-specific environmental challenges.'
  },
  {
    name: 'Creative Africa Alliance',
    type: 'Alliance',
    description: 'Amplifying African artists, musicians, and creators on the global stage with distribution and promotion.'
  },
  {
    name: 'Health Innovation Lab',
    type: 'Lab',
    description: 'Developing and deploying healthcare technology designed for African healthcare systems.'
  }
];

const benefits = [
  {
    title: 'Amplification',
    description: 'Reach millions of builders, creators, and innovators across Africa and the diaspora.'
  },
  {
    title: 'Credibility',
    description: 'Align your brand with the movement defining the future of African innovation.'
  },
  {
    title: 'Access',
    description: 'Connect directly with the continent\'s most ambitious and talented builders.'
  },
  {
    title: 'Impact',
    description: 'Support real innovation that\'s creating jobs, solving problems, and building the future.'
  }
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 text-center">
            Partners
          </h1>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
            Organizations and institutions supporting the #NotWaiting movement and amplifying African innovation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#0C0C0A] p-8 hover:border-[#dd3935] transition-colors"
              >
                <div className="text-sm font-mono uppercase text-[#dd3935] mb-2">
                  {partner.type}
                </div>
                <h2 className="text-2xl font-black uppercase mb-4">{partner.name}</h2>
                <p>{partner.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F5F5F5] py-16 px-6 md:px-12 mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center">
              Why Partner With Us
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="border-l-4 border-[#dd3935] pl-6">
                  <h3 className="text-2xl font-black uppercase mb-3">{benefit.title}</h3>
                  <p className="text-lg">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0C0C0A] text-white p-12 text-center">
            <h2 className="text-4xl font-black uppercase mb-6">Become a Partner</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join us in amplifying African innovation and supporting the builders creating the future.
            </p>
            <div className="space-y-4">
              
             
              <div className="pt-8">
                <Button className="text-lg px-12 py-5">
                  Get in Touch →
                </Button>
              </div>
              <p className="text-sm text-white/60 pt-4">partners@notwaiting.africa</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
