import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import './FileUpload.css';

export interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  label = 'Click or drag menu photo to upload',
  sublabel = 'SVG, PNG, JPG or WEBP (max. 5MB)',
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      className={`wjl-file-upload ${dragActive ? 'wjl-file-upload--active' : ''} ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="wjl-file-upload__input"
        id="wjl-file-input"
      />
      <label htmlFor="wjl-file-input" className="wjl-file-upload__label">
        <UploadCloud size={32} className="wjl-file-upload__icon" />
        <span className="wjl-file-upload__title">{label}</span>
        <span className="wjl-file-upload__sub">{sublabel}</span>
      </label>

      {selectedFile && (
        <div className="wjl-file-upload__preview">
          <ImageIcon size={18} />
          <span className="wjl-file-upload__name">{selectedFile.name}</span>
          <button
            className="wjl-file-upload__remove"
            onClick={() => setSelectedFile(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
