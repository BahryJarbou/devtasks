import Layout from "../components/Layout";
import { Settings as SettingsIcon, User, Shield, Bell, Save } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { data: user } = useAuth();

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-10 w-full max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Configuration_Panel</span>
          </div>
          <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Settings</h1>
        </header>

        <div className="space-y-6">
          <Section icon={User} title="User_Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-muted uppercase">Public_Identifier</label>
                <input disabled value={user?.email || ""} className="w-full bg-bg border border-line p-2 text-sm font-mono opacity-50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-muted uppercase">Display_Alias</label>
                <input placeholder="Enter alias..." className="w-full bg-bg border border-line p-2 text-sm font-mono focus:border-accent outline-none" />
              </div>
            </div>
          </Section>

          <Section icon={Shield} title="Security_Policies">
            <div className="space-y-4">
              <ToggleRow label="Two_Factor_Auth" status="Disabled" />
              <ToggleRow label="Session_Encryption" status="Active" enabled />
              <ToggleRow label="Automatic_Logout" status="After_24h" enabled />
            </div>
          </Section>

          <Section icon={Bell} title="Event_Notifications">
            <div className="space-y-4">
              <ToggleRow label="Email_Alerts" status="Enabled" enabled />
              <ToggleRow label="System_Critical_Logs" status="Enabled" enabled />
            </div>
          </Section>

          <div className="pt-6 border-t border-line flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-sm font-mono text-sm flex items-center gap-2 hover:bg-accent transition-colors shadow-lg active:scale-95">
              <Save className="w-4 h-4" />
              COMMIT_CHANGES
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) {
  return (
    <div className="bg-card border border-line p-6 rounded-sm space-y-4 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-2 pb-4 border-b border-line">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-primary">{title}</h3>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, status, enabled = false }: { label: string, status: string, enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between group/row">
      <div className="space-y-0.5">
        <div className="text-xs font-mono font-bold group-hover/row:text-accent transition-colors">{label}</div>
        <div className="text-[10px] font-mono text-muted uppercase opacity-60 tracking-wider">Status: {status}</div>
      </div>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-accent' : 'bg-line'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
}
