import { useState } from 'react';
import { jobRequestService } from '../service/jobRequestService';

export function useJobRequest() {
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitRequest = async (rawRequestText, inputMode = 'text') => {
    setSubmitting(true);
    setError('');
    setJob(null);
    try {
      const created = await jobRequestService.createJob({ rawRequestText, inputMode });
      setJob(created);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to process your request');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { job, submitting, error, submitRequest };
}