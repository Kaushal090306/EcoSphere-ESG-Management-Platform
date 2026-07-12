"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DownloadReportButton({ filename }: { filename: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      try {
        const dummyContent = `EcoSphere ESG Platform - Compliance Disclosures Transcript\nReport Name: ${filename}\nGenerated: ${new Date().toLocaleDateString()}\nFramework: Certified Audit Ready Document\n\n[CONFIDENTIAL DOCUMENT FOR AUDIT AND INTERNAL COMPLIANCE PURPOSES]`;
        const isXlsx = filename.toLowerCase().includes("xlsx");
        const mime = isXlsx ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf";
        const blob = new Blob([dummyContent], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded ${filename} successfully!`);
      } catch (err) {
        toast.error("Failed to generate file download");
      } finally {
        setDownloading(false);
      }
    }, 800);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      disabled={downloading}
      className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-500/10 rounded-md"
    >
      <Download className={`h-4 w-4 ${downloading ? "animate-pulse" : ""}`} />
    </Button>
  );
}
