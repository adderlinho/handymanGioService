import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/jobsService';
import { assignWorkerToJob } from '../../services/jobWorkersService';
import Step1CustomerAddress from './NuevoTrabajoWizard/Step1CustomerAddress';
import Step2JobDetails from './NuevoTrabajoWizard/Step2JobDetails';
import Step3AssignedWorkers from './NuevoTrabajoWizard/Step3AssignedWorkers';
import Step4PricingSummary from './NuevoTrabajoWizard/Step4PricingSummary';
import type { WizardJobData } from './NuevoTrabajoWizard/types';

const initialData: WizardJobData = {
  // Step 1
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  address_street: '',
  address_unit: '',
  city: 'Chicago',
  state: 'IL',
  zip: '',
  service_area_id: null,
  service_area_name: null,
  
  // Step 2
  title: '',
  service_type: '',
  description: '',
  scheduled_date: '',
  time_window: '',
  status: 'scheduled',
  
  // Step 3
  selectedWorkers: [],
  
  // Step 4
  travel_fee: 0,
  labor_total: 0,
  materials_total: 0,
  other_fees: 0,
  total_amount: 0
};

export default function NuevoTrabajoWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardJobData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateData = (updates: Partial<WizardJobData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Create the job
      const jobData = {
        title: data.title,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone || null,
        customer_email: data.customer_email || null,
        address_street: data.address_street || null,
        address_unit: data.address_unit || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        service_area_id: data.service_area_id,
        service_type: data.service_type,
        description: data.description || null,
        status: data.status,
        scheduled_date: data.scheduled_date || null,
        time_window: data.time_window || null,
        travel_fee: data.travel_fee || null,
        labor_total: data.labor_total || null,
        materials_total: data.materials_total || null,
        other_fees: data.other_fees || null,
        total_amount: data.total_amount || null
      };

      const createdJob = await createJob(jobData);

      // Assign workers to the job
      for (const workerId of data.selectedWorkers) {
        await assignWorkerToJob({
          job_id: createdJob.id,
          worker_id: workerId,
          hours_regular: 0,
          hours_overtime: 0,
          labor_rate: undefined,
          labor_cost: undefined
        });
      }

      // Redirect to jobs list or job detail
      navigate('/admin/trabajos');
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el trabajo');
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CustomerAddress
            data={data}
            updateData={updateData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2JobDetails
            data={data}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3AssignedWorkers
            data={data}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4PricingSummary
            data={data}
            updateData={updateData}
            onBack={handleBack}
            onSave={handleSave}
            saving={saving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Trabajo</h1>
        <div className="mt-4 flex items-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step === currentStep
                      ? 'bg-primary text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <span className="ml-4 text-sm text-slate-600">
            Paso {currentStep} de 4
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {renderStep()}
      </div>
    </div>
  );
}