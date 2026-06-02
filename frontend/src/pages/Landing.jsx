import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'


export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-32">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              Empowering Campuses Digitally
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl leading-tight">
              Campus Placements, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">Streamlined & Smart</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              An all-in-one placement ecosystem connecting students, corporate recruiters, and coordinators. Automate jobs, shortlists, schedules, and analytics in real-time.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/register" 
                className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started Now
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In Portal
              </Link>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 max-w-md w-full">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md relative">
              <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Why HireSync?</h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Centralized student profiles, rapid job application filtering, interview reminders, automated eligibility matching, and custom placement audit summaries.
              </p>
              <div className="mt-6 border-t border-slate-800 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-indigo-400">10x</div>
                  <div className="text-xs text-slate-400 mt-1">Faster Shortlisting</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 mt-1">Digital Audits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="features" className="mx-auto w-full max-w-7xl flex-1 px-6 py-20 space-y-24">
        {/* Features Section */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Features</h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Every Role
            </p>
            <p className="mt-4 text-base text-slate-600">
              A comprehensive toolset developed specifically for student candidates, partner companies, and campus coordinators.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              title="Student Portal" 
              description="Create comprehensive digital profiles, compile achievements, upload resume PDFs, search job vacancies, and trace applications." 
            />
            <FeatureCard 
              title="Company Portal" 
              description="Construct company briefs, announce employment drives, select candidate filters, schedule rounds, and record final selections." 
            />
            <FeatureCard 
              title="Placement Management" 
              description="Oversee corporate listings, monitor student status lists, orchestrate drive schedules, and generate detailed placement success audits." 
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-[2.5rem] p-10 sm:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Trusted by Outstanding Campuses</h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                Empowering colleges with the standard infrastructure required to host modern, competitive recruitment drives at scale.
              </p>
            </div>
            
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 flex-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">1,240+</div>
                <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">Students</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">320+</div>
                <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">Companies</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">1,980+</div>
                <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">Jobs Posted</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">760+</div>
                <div className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">Placements</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

