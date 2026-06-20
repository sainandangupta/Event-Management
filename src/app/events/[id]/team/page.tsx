'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  UserPlus,
  Users,
  ShieldCheck,
  ClipboardList,
  MessageSquare,
  Mail,
  Phone,
  Star,
  Plus,
  X,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { useEvent, useUpdateEvent } from '../../../../modules/event-management/hooks/queries';

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockStaffDirectory = [
  { name: 'Alexander West', role: 'Lead Planner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGBojWphm7TB5uKS82OxyZkQisE-9GTLDdbjRBUDlubqSLeP3V0twsWY-bbJbRZxwONuW4YYoRxxc3Q-ptxNPSe_kKihHHxMra4-cfLyrHKLAKcSCZU9_UNnfKquvh2C-ZfYnWygEF5mRB-vby34THTga8WHMz8u9KEAmoKK_ccURBQCj8j4dmS8DBPqACqpOD4JPa7WeX0_zU6WUHSDpNX0mZBEJkT0kzbTEX5z3lWsEPER7N8HjTcScVTacxsyVps27QoFWRKIIg', email: 'alex@eventhub.com', phone: '+1 (555) 019-3382', rating: 5, status: 'Active' },
  { name: 'Julianne Moore', role: 'Operations Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnWoVe45k7xGA9b9AR5rM9yXdeZ08VDeWQo3EDLe5f1kJ-kYvtAxdlFoGnZ8lNKVZYPiZOAUnFxuH_GXTh8yYLu0XmMIFggyPpHmQFBASNDCPsylsq4KTzFpkFK89zb5j5y7zEtMd1bdJpulEH9sDv-efdshs4TrVa_q2QQNG7Uf3aEjw5qa6hlFRPCLPnIEfUu1UA__pPtnoDlfE5Wywie-DuTboxfi5RCVLdcjCaR5JpB1O98dFQgrc6LF53Q8hCJi-RV8AAFGxZ', email: 'j.moore@eventhub.com', phone: '+1 (555) 092-4412', rating: 4, status: 'Active' },
  { name: 'David Chen', role: 'Creative Director', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAVnkEwLfKtLdWr1gwx8dMroHZ9wcMLN2KvmyugDnsQ4A2e4nLkwmEkk0NLEvZeSeoFpIBdyHt4GJ272JwGIveo0DPcI7-9ww-WwtPtkIvk3yfLB9EWBjG3VKpY7gMI1gcGNVv8ku4kerRy1XofRT8GG-A6vpOaspBT0eIfI5JAPsM9C1NCvLYfwn6cFDoLdvwitdTpwqq4RN8GGCS_Q03HgfFTQhlf2YH1kfhgqIb2WuoPOkNM87bxoltDheQdedh0kMVOWceVmw-', email: 'd.chen@eventhub.com', phone: '+1 (555) 883-2201', rating: 5, status: 'Available' },
  { name: 'Elena Rodriguez', role: 'Finance Officer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChYCJ6hzLqFe9WSsOPKslwerH33xk3SS24HeWsvuSasPlHPYwR5kztvp-xtSKLhgGXYyetj4zLbkiuzPaywrxzvNEiW1tHmEzve_dVYMIPHolstIP3em2A1cCREFwz_nBpCrOExKHvY3Pxe_FR3UwkgPMnNjPFOEgnfHAOOMXM10K8uISSe52Mx7WElmvH57j7W-9E0sFXKdIIfnfalAzdCPnyE4F_66U6qsYsTyA6y7oTyrBT6gGiuAQ7pd-GYyvzPygQMvGZKSIO', email: 'e.rodriguez@eventhub.com', phone: '+1 (555) 441-9088', rating: 4, status: 'Overloaded' },
  { name: 'David Okonjo', role: 'Logistics Specialist', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3NM4voewoe-u4Kd5FFqpfMvc5f3SsVXc3dxKmx5xKUNE9xBzJpd5YpJfP73IwfnwPZYVmCY4a7bN8nFHnM-kIXlMA9SDxziC4ny69knM3okd0C-BZbsExZsgOgp3U6h9qKd-xIjKpG7nkEIhJhclqq8nw4o4QguKtpJ6hntL0bp2_XtZzx2WnPgnpLbcEU3WfvP-KezcUIwePXlFrMA9DPdrYVrZPrSJd_ygTKn0dTQ_BAPqqinzLH-sVSvUBL52j94o5x8VwoYRc', email: 'd.okonjo@eventhub.com', phone: '+1 (555) 774-8832', rating: 4, status: 'Available' },
  { name: 'Sarah Jenkins', role: 'Catering Coordinator', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcQ31Szozvfvm_gtK8MVL-BO796hWT6BMzRGfzbdZCUxB-V1XK_kJLN1w3BwWokW28kjD21DHEQT_qXrGrTPlTNKMbtEYaMsWj5YNI_qm-Uo4BAp4S22O_-xlPJcS-S188pXzlmO9K1GUA8uz0VeR8F3P7L7jKJnN4PJr_gV8a-dxhOWCglU0cPUPZ9qp6F6ykrUdLksVuTpjHYzU48d1dT6bQXSDgNDh5646YWqhBXSk0t88o2raNGAVPeJbRw2So9Scim2OvEoQc', email: 's.jenkins@eventhub.com', phone: '+1 (555) 332-9018', rating: 5, status: 'Active' }
];

export default function EventTeamManagementPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const updateEventMutation = useUpdateEvent();

  // Search & Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Operations Coordinator');

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white rounded-card p-12 text-center border border-border-gray shadow-sm max-w-lg mx-auto mt-12">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="font-hanken text-headline-md font-bold text-on-surface mb-2">Event Not Found</h3>
        <button onClick={() => router.push('/events')} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl cursor-pointer">
          Return to Events
        </button>
      </div>
    );
  }

  // Get staff assigned to this event
  const assignedStaff = mockStaffDirectory.filter((staff) =>
    event.team.includes(staff.name)
  );

  // Available staff not yet in the team
  const availableStaff = mockStaffDirectory.filter(
    (staff) => !event.team.includes(staff.name)
  );

  // Filter available staff by search inside the modal
  const filteredAvailable = availableStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignMember = async (name: string) => {
    const nextTeam = [...event.team, name];
    await updateEventMutation.mutateAsync({
      id: event.id,
      updates: { team: nextTeam }
    });
    alert(`${name} assigned to the event team as ${selectedRole}!`);
    setModalOpen(false);
  };

  const handleRemoveMember = async (name: string) => {
    if (event.team.length <= 1) {
      alert('You must have at least one team member assigned to the event.');
      return;
    }
    if (confirm(`Remove ${name} from this event team?`)) {
      const nextTeam = event.team.filter((m) => m !== name);
      await updateEventMutation.mutateAsync({
        id: event.id,
        updates: { team: nextTeam }
      });
      alert(`${name} removed from the team.`);
    }
  };

  const subTabs = [
    { label: 'Overview', path: `/events/${event.id}` },
    { label: 'Phases', path: `/events/${event.id}/lifecycle` },
    { label: 'Team', path: `/events/${event.id}/team`, active: true },
    { label: 'Planning', path: `/planning` },
    { label: 'Resources', path: `/resources` },
    { label: 'Budget', path: `/budget` },
    { label: 'Vendors', path: `/vendors` },
    { label: 'Documents', path: `/documents` }
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-2 text-body-sm text-on-surface-variant font-medium">
            <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
            <ChevronRight size={14} className="opacity-60" />
            <Link href={`/events/${event.id}`} className="hover:text-primary transition-colors">{event.name}</Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-on-surface font-semibold">Team</span>
          </nav>
          
          <div className="flex items-center gap-2 mb-2 text-primary font-bold">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            <span className="font-sans text-label-sm uppercase tracking-widest">{event.name}</span>
          </div>
          <h2 className="font-hanken text-display-lg font-bold text-on-surface">Collaborators &amp; Staff</h2>
          <p className="text-on-surface-variant max-w-xl mt-3 font-medium text-body-md leading-relaxed">
            Manage the dedicated specialists assigned to this project. Review roles, contact details, and current workloads for the event.
          </p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="btn-gradient text-white px-8 py-3.5 rounded-full font-sans text-label-md font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Assign Team Member</span>
        </button>
      </section>

      {/* Navigation tabs */}
      <div className="glass-card mb-8 p-1.5 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-max gap-1">
          {subTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.path}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all text-label-md ${
                tab.active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-background-alt'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase tracking-wider font-semibold">Total Staff</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">{assignedStaff.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/30 text-tertiary flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase tracking-wider font-semibold">Leads Assigned</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">1</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase tracking-wider font-semibold">Tasks Active</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">14</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-on-surface-variant font-sans text-label-sm uppercase tracking-wider font-semibold">Open Channels</p>
            <p className="font-hanken text-headline-md font-bold text-on-surface">4</p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {assignedStaff.map((staff, idx) => {
          const isLead = idx === 0;
          return (
            <div
              key={staff.name}
              className="tonal-card bg-white p-6 rounded-card border border-border-gray relative overflow-hidden group shadow-sm flex flex-col justify-between"
            >
              {isLead && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Lead
                  </span>
                </div>
              )}
              
              <div>
                <div className="flex items-start gap-4 mb-6 pt-2">
                  <img
                    alt={staff.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-white flex-shrink-0"
                    src={staff.avatar}
                  />
                  <div>
                    <h3 className="font-hanken text-headline-md font-bold text-on-surface leading-tight">
                      {staff.name}
                    </h3>
                    <p className="text-on-surface-variant font-sans text-label-sm font-semibold mt-1">
                      {staff.role}
                    </p>
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: staff.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-sunset-orange fill-sunset-orange" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-medium">
                    <Mail size={14} className="text-primary" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-medium">
                    <Phone size={14} className="text-primary" />
                    <span>{staff.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-gray/50 flex justify-between items-center text-body-sm">
                <button
                  onClick={() => router.push(`/resources`)}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  View Workloads
                </button>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    staff.status === 'Available'
                      ? 'bg-emerald-green/10 text-emerald-green'
                      : staff.status === 'Overloaded'
                      ? 'bg-error-container text-error'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {staff.status}
                  </span>
                  
                  {!isLead && (
                    <button
                      onClick={() => handleRemoveMember(staff.name)}
                      className="p-1 hover:bg-error-container text-error hover:text-error rounded transition-colors cursor-pointer"
                      title="Remove Member"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Specialist dashed trigger card */}
        <div
          onClick={() => setModalOpen(true)}
          className="tonal-card bg-white/40 border-2 border-dashed border-border-gray/60 p-6 rounded-card flex flex-col items-center justify-center text-center hover:bg-white hover:border-primary hover:border-solid transition-all group cursor-pointer min-h-[260px]"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus size={24} className="text-on-surface-variant group-hover:text-primary" />
          </div>
          <h4 className="font-hanken text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">
            Add Specialist
          </h4>
          <p className="text-body-sm text-on-surface-variant px-4 mt-2 font-medium">
            Browse our concierge staff directory for niche experts and operations coordinators.
          </p>
        </div>
      </div>

      {/* Assign specialist dialog modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-gutter">
          {/* backdrop click */}
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <div className="glass-panel relative w-full max-w-2xl bg-white rounded-card shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-border-gray flex justify-between items-center">
              <div>
                <h3 className="font-hanken text-headline-lg font-bold text-on-surface">Assign Specialist</h3>
                <p className="text-on-surface-variant font-sans text-body-sm font-medium mt-1">
                  Select a professional from your organization to join this event team.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-surface-container rounded-full transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto space-y-6 custom-scrollbar">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-white text-body-sm transition-all"
                  placeholder="Search by name, role, or skillset..."
                  type="text"
                />
              </div>

              {/* Select event role */}
              <div className="space-y-2">
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Assign Event Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-background-alt border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary text-body-md cursor-pointer focus:bg-white transition-all font-medium"
                >
                  <option value="Lead Planner">Lead Planner</option>
                  <option value="Operations Coordinator">Operations Coordinator</option>
                  <option value="Finance Officer">Finance Officer</option>
                  <option value="Logistics Specialist">Logistics Specialist</option>
                  <option value="Catering Manager">Catering Manager</option>
                  <option value="Security Consultant">Security Consultant</option>
                </select>
              </div>

              {/* List items */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 px-1">Available Staff</p>
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((staff) => (
                    <div
                      key={staff.name}
                      onClick={() => handleAssignMember(staff.name)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-border-gray group"
                    >
                      <img alt={staff.name} className="w-12 h-12 rounded-full object-cover border border-white" src={staff.avatar} />
                      <div className="flex-1">
                        <p className="font-bold text-on-surface text-label-md leading-tight">{staff.name}</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          {staff.role} • {staff.status}
                        </p>
                      </div>
                      <button className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 shadow-sm">
                        <Check size={12} />
                        <span>Assign</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-body-sm text-on-surface-variant font-medium">
                    No specialists available for assign.
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-surface-container-low border-t border-border-gray/50 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 text-on-surface-variant hover:text-primary font-bold cursor-pointer text-label-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
