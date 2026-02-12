import { useState, useEffect } from "react";
import { Upload, Trash2, Loader2, Check, AlertCircle, Image as ImageIcon, ExternalLink, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ImageFile {
  name: string;
  size?: number;
  createdAt?: string;
}

export function ImageUploadAdmin() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b5eacdbd`;

  useEffect(() => {
    loadImageFiles();
  }, []);

  const loadImageFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/images`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setFiles(data.files || []);
      } else {
        showMessage("error", "Failed to load image files");
      }
    } catch (error) {
      console.error("Error loading image files:", error);
      showMessage("error", "Failed to load image files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showMessage("error", "Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      showMessage("error", `Image size (${fileSizeMB}MB) exceeds 10MB limit. Please compress or resize the image.`);
      event.target.value = ""; // Reset input
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const response = await fetch(`${API_BASE}/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", `Successfully uploaded: ${file.name}`);
        await loadImageFiles();
      } else {
        showMessage("error", data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showMessage("error", "Failed to upload file");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;

    try {
      const response = await fetch(`${API_BASE}/images/${encodeURIComponent(fileName)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", `Deleted: ${fileName}`);
        await loadImageFiles();
      } else {
        showMessage("error", data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      showMessage("error", "Failed to delete file");
    }
  };

  const handleView = async (fileName: string) => {
    try {
      const response = await fetch(`${API_BASE}/images/${encodeURIComponent(fileName)}`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        showMessage("error", "Failed to get image URL");
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
      showMessage("error", "Failed to open image");
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <ImageIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-light text-white tracking-wide">
            IMAGE STORAGE ADMIN
          </h1>
        </div>
        <p className="text-sm text-white/40 font-mono tracking-wider">
          SUPABASE STORAGE MANAGEMENT INTERFACE
        </p>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md"
      >
        <h2 className="text-lg font-light text-white/80 mb-4 tracking-wide">
          ⬢ UPLOAD IMAGE FILES
        </h2>

        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <motion.div
            whileHover={{ scale: uploading ? 1 : 1.02 }}
            whileTap={{ scale: uploading ? 1 : 0.98 }}
            className={`
              flex items-center justify-center gap-3 p-8 
              border-2 border-dashed rounded-xl cursor-pointer
              transition-colors
              ${uploading 
                ? "border-white/20 bg-white/5 cursor-wait" 
                : "border-indigo-500/50 bg-indigo-500/5 hover:border-indigo-400/70 hover:bg-indigo-500/10"
              }
            `}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-white/60 font-mono tracking-wider">
                  UPLOADING...
                </span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-indigo-400" />
                <span className="text-white/80 font-mono tracking-wider">
                  CLICK TO UPLOAD IMAGE
                </span>
              </>
            )
            }
          </motion.div>
        </label>

        <p className="mt-3 text-xs text-white/30 text-center font-mono">
          Supported: PNG, JPG, WEBP, GIF, SVG • Max: 10MB
        </p>
      </motion.div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              mb-6 p-4 rounded-xl border flex items-center gap-3
              ${message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-red-500/10 border-red-500/30 text-red-400"
              }
            `}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-mono text-sm tracking-wide">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files List */}
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-light text-white/80 tracking-wide flex items-center justify-between">
            <span>⬢ STORED IMAGE FILES</span>
            <span className="text-sm text-white/40 font-mono">
              {files.length} FILE{files.length !== 1 ? "S" : ""}
            </span>
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-white/40 font-mono text-sm tracking-wider">
                LOADING...
              </p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-mono text-sm tracking-wider">
                NO IMAGE FILES UPLOADED
              </p>
            </div>
          ) : (
            files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-mono text-sm truncate">
                        {file.name}
                      </p>
                      <p className="text-white/30 font-mono text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleView(file.name)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        title="View image"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(file.name)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-black/20 border border-white/5 rounded-xl">
        <h3 className="text-sm font-mono text-white/60 mb-3 tracking-wider">
          ⬢ USAGE INSTRUCTIONS
        </h3>
        <ul className="space-y-2 text-xs text-white/40 font-mono">
          <li>• Upload your image files (JPG, PNG, GIF, SVG)</li>
          <li>• To use an image as your profile, you can upload it here</li>
          <li>• Click the "View" button to open the image and copy its URL if needed</li>
          <li>• Files are stored securely in Supabase Storage</li>
        </ul>
      </div>
    </div>
  );
}