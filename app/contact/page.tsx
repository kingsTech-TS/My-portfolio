"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MessageSquareMore,
  Terminal,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RetroHeading from "@/components/retro-heading";
import { ScanLines } from "@/components/scan-lines";
import { NeonText } from "@/components/neon-text";
import { RetroGlitch } from "@/components/retro-glitch";
import DigitalRain from "@/components/digital-rain";
import RainToggle from "@/components/rain-toggle";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [showRain, setShowRain] = useState(true);
  const { toast } = useToast();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Status: 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus] = useState("idle");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const addLog = (log: string) => {
    setConsoleLogs((prev) => [...prev, `> ${log}`]);
  };

  const handleDownload = () => {
    toast({
      title: "INITIATING DOWNLOAD",
      description: "Transferring CV data packet...",
      className: "bg-black border-green-500 text-green-400 font-pixel",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setConsoleLogs([]);
    addLog("Initializing transmission protocol...");
    addLog(`Target: SYSTEM_ADMIN`);

    try {
      addLog("Encrypting payload...");
      await new Promise((r) => setTimeout(r, 600)); // Fake delay for effect

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        addLog("Transmission complete.");
        addLog("Status: 200 OK");
        setFormState({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      setStatus("error");
      addLog("ERROR: Connection refused.");
      addLog("Retrying...");
      console.error(error);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

      <ScanLines />

      {showRain && (
        <DigitalRain color="#00ff9b" speed={0.8} density={1.2} opacity={0.15} />
      )}
      <RainToggle onToggle={setShowRain} initialState={showRain} />

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center mb-6 mt-16 text-cyan-500/80 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-pixel tracking-widest">
            [ BACK_TO_ROOT ]
          </span>
        </Link>

        {/* Header Section */}
        <div className="mb-12 border-l-4 border-pink-500 pl-6 py-2 bg-gradient-to-r from-pink-500/10 to-transparent">
          <RetroHeading>
            <h1 className="text-4xl sm:text-6xl font-black font-pixel text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 uppercase tracking-tighter">
              <RetroGlitch>COMM_LINK</RetroGlitch>
            </h1>
          </RetroHeading>
          <p className="mt-2 text-cyan-400/70 font-vt323 text-xl typewriter">
            // ESTABLISH CONNECTION WITH DEVELOPER...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Terminal / Form Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-1 bg-[#0a0a15] rounded-lg border border-pink-500/30 ring-1 ring-white/10">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-pink-500/20 rounded-t-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs font-mono text-gray-500">
                  bash --login
                </div>
              </div>

              <div className="p-6 md:p-8">
                {status === "success" ? (
                  <div className="py-12 text-center animate-in fade-in duration-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 animate-bounce" />
                    <h3 className="mb-2 text-2xl font-bold text-green-400 font-pixel">
                      TRANSMISSION SENT
                    </h3>
                    <p className="mb-6 text-gray-400 font-vt323 text-lg">
                      Packet delivered successfully. Expect a response signal
                      shortly.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-green-500/30 text-left font-mono text-xs text-green-300/80 mb-6">
                      {consoleLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setStatus("idle")}
                      variant="ghost"
                      className="border border-green-500/50 text-green-400 hover:bg-green-500/20 font-pixel text-xs"
                    >
                      [ NEW_TRANSMISSION ]
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <label
                        htmlFor="name"
                        className="text-xs font-bold text-pink-500 font-pixel uppercase tracking-widest"
                      >
                        Identify User_
                      </label>
                      <div className="relative group/input">
                        <span className="absolute left-3 top-3 text-pink-500/50 font-mono">
                          &gt;
                        </span>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          disabled={status === "sending"}
                          className="pl-8 border-0 border-b-2 border-pink-500/30 bg-black/20 text-white font-vt323 text-lg focus:border-pink-500 focus:ring-0 rounded-none transition-all placeholder:text-gray-700"
                          placeholder="ENTER NAME..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold text-pink-500 font-pixel uppercase tracking-widest"
                      >
                        Return Address_
                      </label>
                      <div className="relative group/input">
                        <span className="absolute left-3 top-3 text-pink-500/50 font-mono">
                          &gt;
                        </span>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          disabled={status === "sending"}
                          className="pl-8 border-0 border-b-2 border-pink-500/30 bg-black/20 text-white font-vt323 text-lg focus:border-pink-500 focus:ring-0 rounded-none transition-all placeholder:text-gray-700"
                          placeholder="USER@DOMAIN.COM"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="message"
                        className="text-xs font-bold text-pink-500 font-pixel uppercase tracking-widest"
                      >
                        Data Payload_
                      </label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          disabled={status === "sending"}
                          className="min-h-[150px] border-2 border-pink-500/30 bg-black/40 text-white font-vt323 text-lg focus:border-pink-500 focus:ring-0 rounded-md transition-all placeholder:text-gray-700 p-4 resize-none"
                          placeholder="Enter your message here..."
                        />
                        {/* Blinking cursor effect overlay if focused could be cool, but simplistic is fine */}
                      </div>
                    </div>

                    {status === "sending" && (
                      <div className="bg-black/50 p-2 rounded border border-pink-500/30 font-mono text-xs text-pink-300/80 h-24 overflow-y-auto">
                        {consoleLogs.map((log, i) => (
                          <div key={i} className="animate-pulse">
                            {log}
                          </div>
                        ))}
                        <div className="animate-pulse">_</div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full h-12 bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500 text-pink-400 hover:text-white font-pixel text-sm tracking-widest transition-all group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                      {status === "sending" ? (
                        <span className="animate-pulse">
                          [ SENDING_DATA... ]
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          INITIATE_SEND <Send className="ml-2 w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Social / Info Section */}
          <div className="space-y-8">
            <div className="p-6 border border-cyan-500/30 bg-[#0a0a15]/80 backdrop-blur-sm rounded-lg relative overflow-hidden group">
              {/* Hover scan effect */}
              <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transform skew-x-12 transition-transform duration-1000 group-hover:translate-x-[50%] pointer-events-none"></div>

              <h2 className="mb-6 text-xl font-bold text-cyan-400 font-pixel flex items-center">
                <Terminal className="mr-3 w-5 h-5 text-cyan-500" />
                DIRECT_CHANNELS
              </h2>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: "ndunewesolomon@gmail.com",
                    href: "mailto:ndunewesolomon@gmail.com",
                    color: "yellow",
                  },
                  {
                    icon: Github,
                    label: "github.com/theKingSi",
                    href: "https://github.com/theKingSi?tab=repositories",
                    color: "green",
                  },
                  {
                    icon: MessageSquareMore,
                    label: "WhatsApp Secure Line",
                    href: "https://wa.link/mzkoo2",
                    color: "blue",
                  },
                  {
                    icon: Twitter,
                    label: "twitter.com/oneboilikedat",
                    href: "https://x.com/oneboilikedat",
                    color: "pink",
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-3 border border-${social.color}-500/30 bg-black/40 hover:bg-${social.color}-500/10 hover:border-${social.color}-500 transition-all duration-300 group/link`}
                  >
                    <div
                      className={`p-2 mr-3 bg-${social.color}-500/20 rounded-sm`}
                    >
                      <social.icon
                        className={`w-4 h-4 text-${social.color}-400 group-hover/link:text-${social.color}-300`}
                      />
                    </div>
                    <span
                      className={`text-lg font-vt323 text-gray-400 group-hover/link:text-${social.color}-300 transition-colors`}
                    >
                      {social.label}
                    </span>
                    <span className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity text-xs font-pixel text-gray-500">
                      &lt;LINK_OUT&gt;
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-cyan-500/20">
                <button
                  onClick={handleDownload}
                  className="w-full py-4 border-2 border-dashed border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 hover:bg-red-950/20 font-vt323 text-xl transition-all uppercase tracking-wider flex items-center justify-center group/dl"
                >
                  <span className="mr-2 group-hover/dl:animate-bounce">⬇</span>{" "}
                  DOWNLOAD_CV_FILE
                </button>
              </div>
            </div>

            {/* Office Hours / Status */}
            <div className="p-6 border border-purple-500/30 bg-[#0a0a15]/80 backdrop-blur-sm rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3"></div>
                <h2 className="text-purple-400 font-pixel text-sm uppercase">
                  Server Status: ONLINE
                </h2>
              </div>

              <div className="space-y-2 text-gray-400 font-vt323 text-lg">
                <p className="flex justify-between border-b border-purple-500/10 pb-1">
                  <span>Standard Ops:</span>{" "}
                  <span className="text-purple-300">
                    Mon - Fri (09:00 - 17:00)
                  </span>
                </p>
                <p className="flex justify-between border-b border-purple-500/10 pb-1">
                  <span>Weekend Ops:</span>{" "}
                  <span className="text-purple-300">Sat (09:00 - 15:00)</span>
                </p>
                <p className="pt-2 text-sm text-center opacity-70">
                  // Remote connection available globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
