import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { CheckCircle, Upload, Loader2, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';

const getRequiredDocs = (businessType) => {
  const base = [
    { key: 'pan_url', label: 'PAN Card', required: true },
    { key: 'cancelled_cheque_url', label: 'Cancelled Cheque', required: true },
  ];
  if (businessType === 'proprietorship') {
    return [...base, { key: 'gst_url', label: 'GST Certificate', required: false }];
  }
  if (businessType === 'partnership') {
    return [...base, { key: 'gst_url', label: 'GST Certificate', required: false }, { key: 'partnership_deed_url', label: 'Partnership Deed', required: false }];
  }
  if (businessType === 'trust') {
    return [...base, { key: 'registration_url', label: 'Trust Registration Certificate', required: false }];
  }
  if (businessType === 'llp') {
    return [...base, { key: 'registration_url', label: 'LLP Registration Certificate', required: false }, { key: 'partnership_deed_url', label: 'LLP Agreement', required: false }];
  }
  if (businessType === 'pvt_ltd') {
    return [
      ...base,
      { key: 'gst_url', label: 'GST Certificate', required: false },
      { key: 'moa_url', label: 'MOA (Memorandum of Association)', required: false },
      { key: 'aoa_url', label: 'AOA (Articles of Association)', required: false },
      { key: 'registration_url', label: 'Certificate of Incorporation', required: false },
    ];
  }
  return base;
};

function DocUpload({ docKey, label, required, value, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onUpload(docKey, file_url);
    toast.success(`${label} uploaded`);
    setUploading(false);
  };

  return (
    <div>
      <Label className="text-sm font-medium">
        {label} {required ? <span className="text-destructive">*</span> : <span className="text-xs text-muted-foreground">(Optional)</span>}
      </Label>
      <div className={`mt-1 border-2 border-dashed rounded-xl p-4 flex items-center gap-3 transition-colors ${
        value ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary/50'
      }`}>
        {uploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> :
          value ? <CheckCircle className="w-5 h-5 text-secondary" /> :
          <Upload className="w-5 h-5 text-muted-foreground" />}
        <div className="flex-1">
          {value ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary font-medium">Uploaded</span>
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                <Eye className="w-3 h-3" /> Preview
              </a>
            </div>
          ) : (
            <label className="cursor-pointer">
              <span className="text-sm text-primary font-medium hover:underline">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
              <span className="text-sm text-muted-foreground"> (PDF, JPG, PNG)</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} disabled={uploading} />
            </label>
          )}
        </div>
        {value && (
          <button type="button" onClick={() => onUpload(docKey, '')} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
        )}
      </div>
    </div>
  );
}

export default function Step5Documents({ data, onChange }) {
  const docs = getRequiredDocs(data.business_type);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">KYC Documents</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Upload the required documents for <span className="font-semibold text-foreground capitalize">{data.business_type?.replace(/_/g, ' ') || 'your business type'}</span>.
        </p>
      </div>
      {docs.map((doc) => (
        <DocUpload
          key={doc.key}
          docKey={doc.key}
          label={doc.label}
          required={doc.required}
          value={data[doc.key] || ''}
          onUpload={onChange}
        />
      ))}
    </div>
  );
}
