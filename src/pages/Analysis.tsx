import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, ShieldAlert, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";


import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";
import { fetchAnalysis } from "@/api/analysisService";
import { AnalysisResponse } from "@/types/analysisTypes";

const Analysis = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [visibleStages, setVisibleStages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fileId = searchParams.get("fileId");

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAnalysis(fileId);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch analysis", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      setVisibleStages((v) => {
        if (v >= data.killChainStages.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) return <div className="text-center p-10">Loading analysis...</div>;
  if (!data) return <div className="text-center p-10 text-destructive">No Data Found</div>;

  const downloadReport = async () => {
    if (!data) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    let y = 25;

    // ===== THEME COLORS =====
    const darkBg: [number, number, number] = [9, 15, 25];
    const cardBg: [number, number, number] = [15, 23, 42];
    const primaryCyan: [number, number, number] = [0, 255, 255];
    const indigo: [number, number, number] = [99, 102, 241];
    const redCritical: [number, number, number] = [239, 68, 68];
    const textLight: [number, number, number] = [226, 232, 240];


    // ===== PAGE BACKGROUND =====
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // ===== HEADER STRIP =====
    doc.setFillColor(...cardBg);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...primaryCyan);
    doc.text("CYBERSHIELD THREAT REPORT", pageWidth / 2, 18, { align: "center" });

    y = 40;

    // ===== ATTACK CARD =====
    doc.setFillColor(...cardBg);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 35, 4, 4, "F");

    doc.setTextColor(...textLight);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.attackName, margin + 10, y + 12);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`MITRE ATT&CK: ${data.mitre.join(", ")}`, margin + 10, y + 20);

    const riskColor =
      data.riskLevel === "Critical" ? redCritical : primaryCyan;

    doc.setTextColor(...riskColor);


    doc.setFontSize(18);
    doc.text(
      `${data.riskScore}`,
      pageWidth - margin - 20,
      y + 18
    );

    doc.setFontSize(10);
    doc.text(
      data.riskLevel.toUpperCase(),
      pageWidth - margin - 20,
      y + 26
    );

    y += 50;

    // ===== SECTION TITLE FUNCTION =====
    const sectionTitle = (title: string) => {
      doc.setTextColor(...primaryCyan);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      y += 8;
    };

    // ===== KILL CHAIN =====
    sectionTitle("Cyber Kill Chain Reconstruction");

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textLight);

    data.killChainStages.forEach((stage, i) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = 25;
      }

      doc.setFillColor(...cardBg);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 3, 3, "F");

      doc.text(`${i + 1}. ${stage.stage}`, margin + 6, y + 8);

      const split = doc.splitTextToSize(
        stage.desc,
        pageWidth - margin * 2 - 12
      );

      doc.text(split, margin + 6, y + 14);

      y += 22;
    });

    // ===== VISUAL INTELLIGENCE PAGE =====
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    y = 25;
    sectionTitle("Visual Threat Intelligence");

    const chartIds = ["bar-chart", "radar-chart", "line-chart", "pie-chart"];

    for (let id of chartIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#0f172a",
      });

      const img = canvas.toDataURL("image/png");

      if (y > pageHeight - 90) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = 25;
      }

      doc.addImage(img, "PNG", margin, y, pageWidth - margin * 2, 70);
      y += 80;
    }

    // ===== IOC TABLE =====
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = 25;

    sectionTitle("Indicators of Compromise (IoC)");

    autoTable(doc, {
      startY: y,
      head: [["Type", "Value", "Severity"]],
      body: data.indicators.map((i) => [
        i.type,
        i.value,
        i.severity,
      ]),
      theme: "grid",
      styles: {
        fillColor: cardBg,
        textColor: textLight,
        fontSize: 10,
      },
      headStyles: {
        fillColor: indigo,
        textColor: [255, 255, 255],
      },
    });


    // ===== INCIDENT RESPONSE =====
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = 25;

    sectionTitle("Incident Response Recommendations");

    doc.setTextColor(...textLight);
    doc.setFont("helvetica", "normal");

    data.incidentResponse.forEach((step, i) => {
      const split = doc.splitTextToSize(
        `${i + 1}. ${step}`,
        pageWidth - margin * 2
      );

      doc.text(split, margin, y);
      y += split.length * 6 + 6;
    });

    // ===== FOOTER PAGE NUMBERS =====
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(120);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    doc.save(`CyberShield-Threat-Report-${fileId}.pdf`);
  };

  return (
    <div id="analysis-report" className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Analysis Results
        </h1>
        <Button onClick={downloadReport} className="gap-2">
          <Download size={16} />
          Download Report
        </Button>
      </div>

      {/* Attack Summary */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="text-destructive" />
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-xl font-bold">
              {data.attackName}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              MITRE ATT&CK: {data.mitre.join(", ")}
            </p>

            <p className="text-sm text-foreground mt-2">
              Sophisticated multi-stage attack detected via API intelligence engine.
            </p>
          </div>

          <div className="text-center shrink-0">
            <div className="w-20 h-20 rounded-full border-4 border-destructive flex items-center justify-center">
              <span className="font-heading text-2xl font-bold text-destructive">
                {data.riskScore}
              </span>
            </div>
            <p className="text-xs text-destructive mt-1 font-semibold">
              {data.riskLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Kill Chain */}
      <div className="glass-card p-5">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">
          Cyber Kill Chain Reconstruction
        </h3>

        <div className="space-y-3">
          {data.killChainStages.map((stage, i) => (
            <div
              key={stage.stage}
              className={`flex items-start gap-4 p-3 rounded-lg border transition-all ${i < visibleStages ? "opacity-100" : "opacity-0"
                } ${stage.status === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-secondary/30"
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${stage.status === "critical"
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
                }`}>
                {i + 1}
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm">
                  {stage.stage}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Same UI */}
      <div id="charts-section" className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar */}
        <div id="bar-chart" className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-primary mb-3">
            Affected Areas Impact (%)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.affectedAreas} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,15%)" />
              <XAxis type="number" />
              <YAxis dataKey="area" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="impact" fill="hsl(180,100%,50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div id="radar-chart" className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-primary mb-3">
            Security Impact Radar
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar dataKey="A" fill="hsl(180,100%,50%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Line */}
        <div id="line-chart" className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-primary mb-3">
            Attack Timeline
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="hsl(0,80%,55%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div id="pie-chart" className="glass-card p-4">
          <h3 className="font-heading text-sm font-semibold text-primary mb-3">
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.riskPie}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.riskPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => `${value} incidents`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicators */}
      <div className="glass-card p-4">
        <h3 className="font-heading text-sm font-semibold text-primary mb-3">
          Indicators of Compromise (IoC)
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th>Type</th>
              <th>Value</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {data.indicators.map((ind, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2">{ind.type}</td>
                <td className="py-2 font-mono text-xs">{ind.value}</td>
                <td className="py-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                    {ind.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Incident Response */}
      <div className="glass-card p-5 animate-fade-in">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">
          Incident Response Recommendations
        </h3>

        <div className="space-y-3">
          {data.incidentResponse.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg border border-border bg-secondary/30"
            >
              {/* Step Number */}
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {index + 1}
              </div>

              {/* Response Text */}
              <div className="text-sm text-foreground">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

  );
};

export default Analysis;
