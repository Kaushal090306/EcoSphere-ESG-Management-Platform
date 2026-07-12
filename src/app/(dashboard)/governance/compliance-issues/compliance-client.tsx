"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";

type ComplianceIssueItem = {
  id: string;
  auditId: string | null;
  description: string;
  dueDate: Date | null;
  severity: string;
  status: string;
};

const severityColors: Record<string, string> = {
  critical: "bg-eco-red/10 text-eco-red border-eco-red/20 font-semibold",
  high: "bg-eco-red/10 text-eco-red border-eco-red/20 font-semibold",
  medium: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
  low: "bg-muted text-muted-foreground",
};

const statusColors: Record<string, string> = {
  resolved: "bg-eco-green/10 text-eco-green border-eco-green/20",
  closed: "bg-eco-green/10 text-eco-green border-eco-green/20",
  in_progress: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
  open: "bg-eco-red/10 text-eco-red border-eco-red/20 animate-pulse",
};

export function ComplianceClient({
  issues,
  audits,
}: {
  issues: ComplianceIssueItem[];
  audits: { id: string; title: string }[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate-asc");

  const auditName = (id: string | null) =>
    audits.find((a) => a.id === id)?.title || "General Compliance";

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  const filteredIssues = issues
    .filter((i) => {
      const matchSearch = i.description.toLowerCase().includes(search.toLowerCase()) || 
                          auditName(i.auditId).toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      const matchSeverity = severityFilter === "all" || i.severity === severityFilter;
      return matchSearch && matchStatus && matchSeverity;
    })
    .sort((a, b) => {
      const nameA = auditName(a.auditId);
      const nameB = auditName(b.auditId);

      if (sortBy === "source-asc") return nameA.localeCompare(nameB);
      if (sortBy === "source-desc") return nameB.localeCompare(nameA);
      
      if (sortBy === "description-asc") return a.description.localeCompare(b.description);
      if (sortBy === "description-desc") return b.description.localeCompare(a.description);
      
      if (sortBy === "dueDate-asc") {
        const d1 = a.dueDate ? a.dueDate.getTime() : 0;
        const d2 = b.dueDate ? b.dueDate.getTime() : 0;
        return d1 - d2;
      }
      if (sortBy === "dueDate-desc") {
        const d1 = a.dueDate ? a.dueDate.getTime() : 0;
        const d2 = b.dueDate ? b.dueDate.getTime() : 0;
        return d2 - d1;
      }
      
      if (sortBy === "severity-asc") return a.severity.localeCompare(b.severity);
      if (sortBy === "severity-desc") return b.severity.localeCompare(a.severity);
      
      if (sortBy === "status-asc") return a.status.localeCompare(b.status);
      if (sortBy === "status-desc") return b.status.localeCompare(a.status);
      
      return 0;
    });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6 max-w-3xl">
        <Input
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-[#f4f4f5] dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground rounded-lg h-9 text-xs"
        />
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
          <SelectTrigger className="w-36 bg-[#f4f4f5] dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground rounded-lg h-9 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={(val) => setSeverityFilter(val || "")}>
          <SelectTrigger className="w-36 bg-[#f4f4f5] dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground rounded-lg h-9 text-xs">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#121118] border-[#ececee] dark:border-[#221f2c] text-foreground">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredIssues.length === 0 ? (
            <EmptyState title="No compliance issues found" description="Adjust search query or select filters." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#121118]">
                  <TableHead 
                    className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("source")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Linked Audit / Source</span>
                      {sortBy === "source-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "source-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("description")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Description</span>
                      {sortBy === "description-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "description-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("dueDate")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Due Date</span>
                      {sortBy === "dueDate-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "dueDate-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground font-semibold px-6 py-3 text-left text-[11px] uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("severity")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Severity</span>
                      {sortBy === "severity-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "severity-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground font-semibold px-6 py-3 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors text-right pr-6"
                    onClick={() => handleSortClick("status")}
                  >
                    <div className="flex items-center gap-1.5 justify-end">
                      <span>Status</span>
                      {sortBy === "status-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "status-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((i) => (
                  <TableRow key={i.id} className="border-b border-[#ececee] dark:border-[#221f2c] last:border-0 hover:bg-[#f4f4f5] dark:hover:bg-[#16141f]/50 transition-colors">
                    <TableCell className="font-semibold text-foreground pl-6">
                      {auditName(i.auditId)}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">{i.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(i.dueDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityColors[i.severity] || "bg-muted text-muted-foreground"}>
                        {i.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className={statusColors[i.status] || "bg-muted text-muted-foreground"}>
                        {i.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
