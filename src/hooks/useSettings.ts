import { useEffect, useState } from "react";

export const SETTINGS_API = "https://functions.poehali.dev/078ff279-9629-4a56-aafd-320b31495ab7";

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  telegram: string;
  youtube: string;
  vk: string;
  whatsapp: string;
}

const defaultSettings: SiteSettings = {
  phone: "",
  email: "",
  address: "",
  instagram: "",
  telegram: "",
  youtube: "",
  vk: "",
  whatsapp: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SETTINGS_API)
      .then((r) => r.json())
      .then((data) => {
        setSettings({ ...defaultSettings, ...(data.settings || {}) });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { settings, loading };
}
