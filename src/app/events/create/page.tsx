'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info, DollarSign, Rocket, LayoutGrid, Users, ArrowLeft } from 'lucide-react';
import { useEventManagementStore } from '../../../modules/event-management/services/store';
import { useCreateEvent } from '../../../modules/event-management/hooks/queries';
import { EventCategory, EventStatus } from '../../../modules/event-management/types';

const schema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  category: z.enum(['Corporate', 'Wedding', 'Gala']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['Planned', 'In Progress', 'Completed']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  estimatedRevenue: z.number().min(0, 'Estimated Revenue must be positive'),
  handoff: z.boolean(),
  template: z.enum(['Premium Gala', 'Executive Summit']),
  team: z.array(z.string()).min(1, 'Assign at least one team member')
});

type FormValues = z.infer<typeof schema>;

const mockStaff = [
  { name: 'Alexander West', role: 'Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGBojWphm7TB5uKS82OxyZkQisE-9GTLDdbjRBUDlubqSLeP3V0twsWY-bbJbRZxwONuW4YYoRxxc3Q-ptxNPSe_kKihHHxMra4-cfLyrHKLAKcSCZU9_UNnfKquvh2C-ZfYnWygEF5mRB-vby34THTga8WHMz8u9KEAmoKK_ccURBQCj8j4dmS8DBPqACqpOD4JPa7WeX0_zU6WUHSDpNX0mZBEJkT0kzbTEX5z3lWsEPER7N8HjTcScVTacxsyVps27QoFWRKIIg' },
  { name: 'Julianne Moore', role: 'Operations', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnWoVe45k7xGA9b9AR5rM9yXdeZ08VDeWQo3EDLe5f1kJ-kYvtAxdlFoGnZ8lNKVZYPiZOAUnFxuH_GXTh8yYLu0XmMIFggyPpHmQFBASNDCPsylsq4KTzFpkFK89zb5j5y7zEtMd1bdJpulEH9sDv-efdshs4TrVa_q2QQNG7Uf3aEjw5qa6hlFRPCLPnIEfUu1UA__pPtnoDlfE5Wywie-DuTboxfi5RCVLdcjCaR5JpB1O98dFQgrc6LF53Q8hCJi-RV8AAFGxZ' },
  { name: 'David Chen', role: 'Creative', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAVnkEwLfKtLdWr1gwx8dMroHZ9wcMLN2KvmyugDnsQ4A2e4nLkwmEkk0NLEvZeSeoFpIBdyHt4GJ272JwGIveo0DPcI7-9ww-WwtPtkIvk3yfLB9EWBjG3VKpY7gMI1gcGNVv8ku4kerRy1XofRT8GG-A6vpOaspBT0eIfI5JAPsM9C1NCvLYfwn6cFDoLdvwitdTpwqq4RN8GGCS_Q03HgfFTQhlf2YH1kfhgqIb2WuoPOkNM87bxoltDheQdedh0kMVOWceVmw-' }
];

export default function CreateEventPage() {
  const router = useRouter();
  const createEventMutation = useCreateEvent();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: 'Corporate',
      description: '',
      status: 'Planned',
      startDate: '',
      endDate: '',
      estimatedRevenue: 0,
      handoff: true,
      template: 'Premium Gala',
      team: ['Alexander West']
    }
  });

  const selectedTeam = watch('team');

  const onSubmit = async (data: FormValues) => {
    try {
      const datesString = `${new Date(data.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      })} - ${new Date(data.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })}`;

      await createEventMutation.mutateAsync({
        name: data.name,
        category: data.category as EventCategory,
        description: data.description,
        status: data.status as EventStatus,
        dates: datesString,
        estimatedRevenue: data.estimatedRevenue,
        phase: 'Concept',
        owner: data.team[0] || 'Alexander West',
        team: data.team,
        venue: data.template === 'Premium Gala' ? 'Ritz-Carlton Ballroom' : 'Grand Hyatt Ballroom'
      });

      alert('Event created successfully!');
      
      // If handoff toggled, go straight to Planning. Else go to list.
      if (data.handoff) {
        router.push('/planning');
      } else {
        router.push('/events');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating event.');
    }
  };

  const toggleTeamMember = (name: string) => {
    const current = [...selectedTeam];
    const index = current.indexOf(name);
    if (index > -1) {
      // Don't remove Alexander if it's the only one
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(name);
    }
    setValue('team', current, { shouldValidate: true });
  };

  return (
    <div className="pt-8 pb-16 px-gutter max-w-5xl mx-auto">
      {/* Back button and title */}
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4 font-sans text-label-md cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>
        <h3 className="font-hanken text-headline-lg font-bold text-on-surface">Event Configuration</h3>
        <p className="font-sans text-body-lg text-on-surface-variant mt-2">
          Configure your upcoming experience with our boutique event management tools.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="bg-surface-container-lowest p-8 rounded-card shadow-sm border border-border-gray hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Info size={20} />
            </div>
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">General Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Event Name</label>
              <input
                {...register('name')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all"
                placeholder="e.g. Global Tech Summit 2024"
                type="text"
              />
              {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Category</label>
              <select
                {...register('category')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
              >
                <option value="Corporate">Corporate Conference</option>
                <option value="Wedding">Wedding</option>
                <option value="Gala">Gala Dinner</option>
              </select>
              {errors.category && <p className="text-xs text-error font-medium">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Description</label>
              <textarea
                {...register('description')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all"
                placeholder="Briefly describe the purpose and scope of this event..."
                rows={4}
              ></textarea>
              {errors.description && <p className="text-xs text-error font-medium">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Initial Status</label>
              <select
                {...register('status')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Budget */}
        <div className="bg-surface-container-lowest p-8 rounded-card shadow-sm border border-border-gray hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-secondary-container/30 p-2 rounded-lg text-secondary">
              <DollarSign size={20} />
            </div>
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">Logistics & Revenue</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Start Date</label>
              <input
                {...register('startDate')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
                type="date"
              />
              {errors.startDate && <p className="text-xs text-error font-medium">{errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">End Date</label>
              <input
                {...register('endDate')}
                className="w-full bg-background-alt border-none rounded-xl p-4 font-sans text-body-md focus:bg-white transition-all cursor-pointer"
                type="date"
              />
              {errors.endDate && <p className="text-xs text-error font-medium">{errors.endDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-sans text-label-md text-on-surface block font-semibold">Revenue Estimate</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                <input
                  {...register('estimatedRevenue', { valueAsNumber: true })}
                  className="w-full bg-background-alt border-none rounded-xl py-4 pl-8 pr-4 font-sans text-body-md focus:bg-white transition-all"
                  placeholder="0.00"
                  type="number"
                />
              </div>
              {errors.estimatedRevenue && <p className="text-xs text-error font-medium">{errors.estimatedRevenue.message}</p>}
            </div>
          </div>
        </div>

        {/* Handoff Checkbox */}
        <div className="bg-surface-container-lowest p-8 rounded-card shadow-sm border border-border-gray hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-surface-container-high p-2 rounded-lg text-primary">
                <Rocket size={20} />
              </div>
              <div>
                <h4 className="font-hanken text-label-md font-bold text-on-surface">Planning Handoff</h4>
                <p className="text-label-sm text-on-surface-variant font-medium">
                  Automatically move to planning module upon creation
                </p>
              </div>
            </div>
            
            <Controller
              name="handoff"
              control={control}
              render={({ field }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              )}
            />
          </div>
        </div>

        {/* Templates & Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Radio Template Selection */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-card shadow-sm border border-border-gray">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">Select Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="template"
                control={control}
                render={({ field }) => (
                  <>
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="template"
                        value="Premium Gala"
                        checked={field.value === 'Premium Gala'}
                        onChange={() => field.onChange('Premium Gala')}
                        className="sr-only peer"
                      />
                      <div className="p-4 rounded-xl border-2 border-transparent bg-background-alt peer-checked:border-primary peer-checked:bg-primary-container/20 transition-all duration-200 h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <LayoutGrid size={18} className="text-primary" />
                          <span className="font-bold text-on-surface text-label-md">Premium Gala</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Includes guest list automation, menu selection checklists, and seating templates.
                        </p>
                      </div>
                    </label>

                    <label className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="template"
                        value="Executive Summit"
                        checked={field.value === 'Executive Summit'}
                        onChange={() => field.onChange('Executive Summit')}
                        className="sr-only peer"
                      />
                      <div className="p-4 rounded-xl border-2 border-transparent bg-background-alt peer-checked:border-primary peer-checked:bg-primary-container/20 transition-all duration-200 h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <LayoutGrid size={18} className="text-secondary" />
                          <span className="font-bold text-on-surface text-label-md">Executive Summit</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Focused on speaker agendas, sponsorship tracking tiers, and venue logistics.
                        </p>
                      </div>
                    </label>
                  </>
                )}
              />
            </div>
          </div>

          {/* Team Checkbox Selection */}
          <div className="bg-surface-container-lowest p-8 rounded-card shadow-sm border border-border-gray">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">Assign Team</h4>
            <div className="space-y-3">
              {mockStaff.map((staff) => {
                const assigned = selectedTeam.includes(staff.name);
                return (
                  <div
                    key={staff.name}
                    onClick={() => toggleTeamMember(staff.name)}
                    className={`flex items-center justify-between p-3 rounded-xl bg-background-alt hover:bg-surface-container-high transition-colors cursor-pointer group border ${
                      assigned ? 'border-primary/20 bg-primary/5' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="h-8 w-8 rounded-full object-cover border border-white"
                        src={staff.avatar}
                        alt={staff.name}
                      />
                      <div className="flex flex-col">
                        <span className="text-label-md font-bold text-on-surface">{staff.name}</span>
                        <span className="text-[10px] font-bold text-primary">{staff.role}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={assigned}
                      readOnly
                      className="rounded text-primary focus:ring-primary border-outline-variant h-4 w-4"
                    />
                  </div>
                );
              })}
              {errors.team && <p className="text-xs text-error font-medium">{errors.team.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-border-gray">
          <button
            onClick={() => router.back()}
            type="button"
            className="px-8 py-3 rounded-xl font-sans text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient px-10 py-3 rounded-xl font-hanken text-label-md font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
