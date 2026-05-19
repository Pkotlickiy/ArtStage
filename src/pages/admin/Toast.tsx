import Icon from "@/components/ui/icon";

const Toast = ({ toast }: { toast: { msg: string; type: "ok" | "err" } | null }) =>
  toast ? (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl font-body text-sm ${toast.type === "ok" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>
      <Icon name={toast.type === "ok" ? "CheckCircle" : "AlertCircle"} size={16} />
      {toast.msg}
    </div>
  ) : null;

export default Toast;
