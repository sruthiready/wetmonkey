import React, { useState, useEffect } from "react";
import { load, save } from "../service/storage";

export default function SettingsView({
  frogName,
  userEmail,
  setFrogName,
  schedulerSendDaily,
  schedulerSendWeekly,
}) {
  const [serviceId, setServiceId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const cfg = await load("email_config");
      if (cfg) {
        setServiceId(cfg.serviceId || "");
        setTemplateId(cfg.templateId || "");
        setPublicKey(cfg.publicKey || "");
      }
    })();
  }, []);

  const saveCfg = async () => {
    await save("email_config", { serviceId, templateId, publicKey });
    setStatus("Saved email config ✔️");
    setTimeout(() => setStatus(""), 2500);
  };

  const sendTest = async () => {
    try {
      setStatus("Sending test email...");
      await schedulerSendDaily({ force: true });
      setStatus("Test email sent! 🐸");
      setTimeout(() => setStatus(""), 2500);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Frog Identity */}
      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Frog Identity</h3>

        {/* Frog Name */}
        <div className="mt-3">
          <label className="text-sm block text-gray-700">Frog Name</label>
          <input
            value={frogName}
            onChange={(e) => setFrogName(e.target.value)}
            className="px-3 py-2 border rounded w-full focus:ring-2 focus:ring-frog-800"
          />
        </div>

        {/* Email */}
        <div className="mt-3 text-sm text-gray-700">
          Email that receives digests:
          <strong className="ml-2 text-frog-900">{userEmail}</strong>
        </div>
      </div>

      {/* EmailJS Config */}
      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">EmailJS Settings</h3>

        <p className="text-sm text-gray-600 mt-1">
          Add your EmailJS credentials so Moist Frog can send daily & weekly
          digests.
        </p>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <input
            placeholder="EmailJS Service ID"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-frog-800"
          />
          <input
            placeholder="EmailJS Template ID"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-frog-800"
          />
          <input
            placeholder="EmailJS Public Key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-frog-800"
          />
        </div>

        <div className="mt-4 flex gap-3 items-center">
          <button
            onClick={saveCfg}
            className="bg-frog-900 text-white px-4 py-2 rounded hover:bg-frog-800"
          >
            Save Config
          </button>

          <button
            onClick={sendTest}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500"
          >
            Send Test Email
          </button>

          <span className="text-sm text-gray-600">{status}</span>
        </div>

        {/* Manual triggers */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700">Manual Runs</h4>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => schedulerSendDaily({ force: true })}
              className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
            >
              Send Daily Now
            </button>

            <button
              onClick={() => schedulerSendWeekly({ force: true })}
              className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
            >
              Send Weekly Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
