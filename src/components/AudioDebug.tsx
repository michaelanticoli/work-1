import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function AudioDebug() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b5eacdbd/audio`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading audio files...</div>;
  }

  return (
    <div className="p-8 bg-black/80 border border-white/20 rounded-xl">
      <h2 className="text-xl font-mono text-white mb-4">AUDIO FILES IN SUPABASE STORAGE</h2>
      {files.length === 0 ? (
        <p className="text-white/60 font-mono">No files found</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.name} className="p-3 bg-white/5 rounded font-mono text-sm text-white/80">
              {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
