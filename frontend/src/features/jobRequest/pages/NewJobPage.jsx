import { Link } from 'react-router-dom';
import { JobRequestProvider, useJobRequestContext } from '../jobRequestContext';
import JobRequestForm from '../components/JobRequestForm';
import JobGraphPreview from '../components/JobGraphPreview';
import Navbar from '../../../shared/components/Navbar';

function NewJobPageInner() {
  const { job } = useJobRequestContext();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Link
          to="/customer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8861B] hover:text-[#A57412] mb-5 transition-colors"
        >
          ← Back to my service requests
        </Link>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
            AI-Assisted Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
            New Cooperative Service Request
          </h1>
          <p className="text-xs sm:text-sm text-[#596174] mt-1.5 leading-relaxed">
            Tell us what you need in everyday language or speak via microphone — Sahyog Flow breaks down multi-skill work into coordinated tasks and dispatches local cooperative workers.
          </p>
        </div>

        <JobRequestForm />

        {job && (
          <div className="mt-8">
            <JobGraphPreview job={job} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewJobPage() {
  return (
    <JobRequestProvider>
      <NewJobPageInner />
    </JobRequestProvider>
  );
}