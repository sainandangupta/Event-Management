'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FolderOpen,
  FileText,
  Upload,
  Plus,
  Trash2,
  Lock,
  Loader2,
  AlertCircle,
  FileCode,
  User,
  Clock,
  History,
  TrendingUp,
  Download,
  X
} from 'lucide-react';
import { useEventManagementStore } from '../../modules/event-management/services/store';
import { useDocuments, useCreateDocument, useCreateDocumentVersion } from '../../modules/event-management/hooks/queries';

// Zod schema for new document upload
const docUploadSchema = z.object({
  name: z.string().min(3, 'Document name must be at least 3 characters'),
  type: z.enum(['PDF', 'CSV', 'DOCX', 'XLSX']),
  size: z.string().min(1, 'File size description is required')
});

type DocFormValues = z.infer<typeof docUploadSchema>;

function DocumentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'library';

  const { currentEventId, events, currentUser } = useEventManagementStore();
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  const { data: documents = [], isLoading: documentsLoading } = useDocuments(currentEventId || undefined);
  const createDocumentMutation = useCreateDocument();
  const createVersionMutation = useCreateDocumentVersion();

  // Dialog Overlay states
  const [uploading, setUploading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DocFormValues>({
    resolver: zodResolver(docUploadSchema),
    defaultValues: {
      name: '',
      type: 'PDF',
      size: '2.4 MB'
    }
  });

  const onSubmitDoc = async (data: DocFormValues) => {
    if (!currentEventId) return;
    try {
      await createDocumentMutation.mutateAsync({
        eventId: currentEventId,
        name: data.name.includes('.') ? data.name : `${data.name}.${data.type.toLowerCase()}`,
        type: data.type,
        size: data.size,
        author: currentUser.name
      });
      alert('Document uploaded successfully to library!');
      reset();
      setUploading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReleaseNewVersion = async (docId: string) => {
    try {
      await createVersionMutation.mutateAsync({
        id: docId,
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        eventId: currentEventId || ''
      });
      alert('New version drafted and released!');
    } catch (err) {
      console.error(err);
    }
  };

  // Find document selected for version details
  const activeDetailDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || null;
  }, [documents, selectedDocId]);

  if (documentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-primary font-bold text-label-sm uppercase tracking-wider block mb-1">
            {currentEvent?.name || 'All Events'}
          </span>
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">Document Library</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Manage floor plans, contracts agreements, seating charts, and version releases.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedDocId(null);
              router.push('/documents?view=library');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer text-label-md transition-colors ${
              view === 'library' && !selectedDocId ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <FolderOpen size={16} />
            <span>Library</span>
          </button>
          <button
            onClick={() => setUploading(true)}
            className="px-4 py-2.5 bg-primary text-white font-sans text-label-md rounded-xl hover:bg-opacity-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Upload size={16} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Library List + Version Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Documents Table */}
        <div className="lg:col-span-2 bg-white rounded-card border border-border-gray shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-gray">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">Event Attachments</h4>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-border-gray text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  <th className="px-8 py-5">File Details</th>
                  <th className="px-6 py-5">Format</th>
                  <th className="px-6 py-5">Version</th>
                  <th className="px-6 py-5">Last Modified</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray text-body-md font-medium">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`hover:bg-surface/30 transition-colors cursor-pointer ${
                      selectedDocId === doc.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-on-surface hover:text-primary transition-colors truncate max-w-xs">{doc.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-wider flex items-center gap-1">
                        <User size={10} className="text-primary" />
                        <span>Uploaded by: {doc.author} ({doc.size})</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-on-surface-variant">
                      {doc.type}
                    </td>
                    <td className="px-6 py-5 text-body-sm font-bold text-primary">
                      {doc.version}
                    </td>
                    <td className="px-6 py-5 text-body-sm text-on-surface font-medium">
                      {doc.lastModified}
                    </td>
                    <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocId(doc.id)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Version History"
                        >
                          <History size={16} />
                        </button>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert('Downloading file mock...');
                          }}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Version History details panel */}
        <div className="space-y-6">
          {activeDetailDoc ? (
            <div className="bg-white p-6 rounded-card border border-border-gray shadow-sm">
              <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">Version History Control</h4>
              
              <div className="space-y-4 font-semibold text-body-sm text-on-surface">
                <div className="p-3 bg-background-alt rounded-xl border border-border-gray/30 mb-4">
                  <p className="font-bold text-primary truncate">{activeDetailDoc.name}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Author: {activeDetailDoc.author}</p>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Current Release</span>
                  <span className="text-primary font-bold">{activeDetailDoc.version}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>File Size</span>
                  <span className="text-on-surface-variant">{activeDetailDoc.size}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-gray/30">
                  <span>Last Updated</span>
                  <span className="text-on-surface-variant">{activeDetailDoc.lastModified}</span>
                </div>
                
                <button
                  onClick={() => handleReleaseNewVersion(activeDetailDoc.id)}
                  className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-primary/10 mt-6"
                >
                  <Plus size={16} />
                  <span>Release New Version</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low/30 p-6 rounded-card border border-dashed border-border-gray/70 text-center font-medium">
              <History size={24} className="text-on-surface-variant/40 mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Select a document from the library table to audit version history log timelines.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Overlay Modal */}
      {uploading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-white/40 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-hanken text-headline-md font-bold text-on-surface">Upload Document</h3>
              <button
                onClick={() => setUploading(false)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitDoc)} className="space-y-4 font-sans text-body-sm">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Document Name</label>
                <input
                  {...register('name')}
                  className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                  placeholder="e.g. Summer Gala Seating Blueprint"
                  type="text"
                />
                {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase">File Format</label>
                  <select
                    {...register('type')}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white cursor-pointer transition-all font-semibold"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="CSV">CSV Data sheet</option>
                    <option value="DOCX">Word Document</option>
                    <option value="XLSX">Excel Ledger</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase">Simulated Size</label>
                  <input
                    {...register('size')}
                    className="w-full bg-background-alt border-none rounded-xl p-3.5 focus:bg-white transition-all text-body-sm font-semibold"
                    placeholder="e.g. 1.2 MB"
                    type="text"
                  />
                  {errors.size && <p className="text-xs text-error font-medium">{errors.size.message}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setUploading(false)}
                  className="px-6 py-2 text-on-surface-variant hover:text-primary font-bold cursor-pointer text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer text-label-md shadow-sm"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <DocumentsPageContent />
    </Suspense>
  );
}
