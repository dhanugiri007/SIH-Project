import { JobRequestProvider, useJobRequestContext } from '../jobRequestContext';
import JobRequestForm from '../components/JobRequestForm';
import JobGraphPreview from '../components/JobGraphPreview';

function NewJobPageInner() {
  const { job } = useJobRequestContext();

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">New Service Request</h1>
        <p className="text-gray-500 text-sm mb-6">
          Tell us what you need in your own words — SAHYOG FLOW will break it down into tasks automatically.
        </p>

        <JobRequestForm />

        {job && (
          <div className="mt-6">
            <JobGraphPreview job={job} />
          </div>
        )}
      </div>
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