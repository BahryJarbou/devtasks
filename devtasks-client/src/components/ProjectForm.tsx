import { useState } from "react";
import { Plus, Terminal, AlertCircle } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (name: string, description?: string) => void;
  isLoading?: boolean;
}

export default function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Project name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (name.length > 50) {
      newErrors.name = "Name must be under 50 characters";
    }

    if (description.length > 200) {
      newErrors.description = "Description must be under 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(name, description || undefined);
      setName("");
      setDescription("");
      setErrors({});
    }
  };

  return (
    <div className="bg-card border border-line p-6 shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-2 mb-4">
          <Terminal className="w-3 h-3 text-accent" />
          CMD :: INIT_NEW_PROJECT
        </h3>
        
        <div className="space-y-3">
          <div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="Project Name (e.g., Alpha_Core)"
              className={`w-full bg-bg border ${errors.name ? 'border-red-500' : 'border-line'} px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-all placeholder:opacity-30`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 font-mono mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name.toUpperCase()}
              </p>
            )}
          </div>

          <div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Project Description (Optional)..."
              rows={2}
              className={`w-full bg-bg border ${errors.description ? 'border-red-500' : 'border-line'} px-4 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-all placeholder:opacity-30 resize-none`}
            />
            {errors.description && (
              <p className="text-[10px] text-red-500 font-mono mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading || !name.trim()}
          className={`
            w-full bg-primary text-white p-3 font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2
            ${isLoading || !name.trim() ? 'opacity-30' : 'hover:bg-accent active:scale-95 shadow-lg shadow-accent/20'}
          `}
        >
          {isLoading ? (
            <Terminal className="w-4 h-4 animate-pulse" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          EXECUTE_INITIALIZATION
        </button>
      </form>
    </div>
  );
}
