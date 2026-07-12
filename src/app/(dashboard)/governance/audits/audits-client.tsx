"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ChevronUp, ChevronDown } from "lucide-react";

type AuditItem = {
  id: string;
  title: string;
  departmentId: string;
  auditorId: string;
  scheduledDate: Date | null;
  status: string;
};

const statusColors: Record<string, string> = {
  completed: "bg-eco-green/10 text-eco-green border-eco-green/20",
  in_progress: "bg-eco-orange/10 text-eco-orange border-eco-orange/20",
  scheduled: "bg-muted text-muted-foreground",
};

export function AuditsClient({
  audits,
  departments,
}: {
  audits: AuditItem[];
  departments: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

  const deptName = (id: string) =>
    departments.find((d) => d.id === id)?.name || "—";

  const handleSortClick = (field: string) => {
    if (sortBy === `${field}-asc`) {
      setSortBy(`${field}-desc`);
    } else {
      setSortBy(`${field}-asc`);
    }
  };

  const filteredAudits = audits
    .filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchDept = deptFilter === "all" || a.departmentId === deptFilter;
      return matchSearch && matchStatus && matchDept;
    })
    .sort((a, b) => {
      const nameA = deptName(a.departmentId);
      const nameB = deptName(b.departmentId);

      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      
      if (sortBy === "dept-asc") return nameA.localeCompare(nameB);
      if (sortBy === "dept-desc") return nameB.localeCompare(nameA);
      
      if (sortBy === "auditor-asc") return a.auditorId.localeCompare(b.auditorId);
      if (sortBy === "auditor-desc") return b.auditorId.localeCompare(a.auditorId);
      
      if (sortBy === "date-asc") {
        const d1 = a.scheduledDate ? a.scheduledDate.getTime() : 0;
        const d2 = b.scheduledDate ? b.scheduledDate.getTime() : 0;
        return d1 - d2;
      }
      if (sortBy === "date-desc") {
        const d1 = a.scheduledDate ? a.scheduledDate.getTime() : 0;
        const d2 = b.scheduledDate ? b.scheduledDate.getTime() : 0;
        return d2 - d1;
      }
      
      if (sortBy === "status-asc") return a.status.localeCompare(b.status);
      if (sortBy === "status-desc") return b.status.localeCompare(a.status);
      
      return 0;
    });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6 max-w-3xl">
        <Input
          placeholder="Search audits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-[#181922] border-[#2d2f39] text-white rounded-lg h-9 text-xs"
        />
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
          <SelectTrigger className="w-36 bg-[#181922] border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#181922] border-[#2d2f39] text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={(val) => setDeptFilter(val || "")}>
          <SelectTrigger className="w-44 bg-[#181922] border-[#2d2f39] text-[#09090b] dark:text-white rounded-lg h-9 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent className="bg-[#181922] border-[#2d2f39] text-white">
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-[#ececee] dark:border-[#2d2f39] bg-white dark:bg-[#181922] rounded-md overflow-hidden shadow-none py-0">
        <CardContent className="p-0">
          {filteredAudits.length === 0 ? (
            <EmptyState title="No compliance audits found" description="Adjust search query or select filters." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("title")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Audit Title</span>
                      {sortBy === "title-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "title-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("dept")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Department</span>
                      {sortBy === "dept-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "dept-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("auditor")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Auditor ID</span>
                      {sortBy === "auditor-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "auditor-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-foreground cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSortClick("date")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Scheduled Date</span>
                      {sortBy === "date-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "date-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-white cursor-pointer hover:bg-white/5 transition-colors text-right pr-4"
                    onClick={() => handleSortClick("status")}
                  >
                    <div className="flex items-center gap-1.5 justify-end pr-2">
                      <span>Status</span>
                      {sortBy === "status-asc" && <ChevronUp className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                      {sortBy === "status-desc" && <ChevronDown className="h-3.5 w-3.5 text-[#9B5CF6]" />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-white">{a.title}</TableCell>
                    <TableCell className="text-muted-foreground">{deptName(a.departmentId)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.auditorId.substring(0, 8)}...</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.scheduledDate ? a.scheduledDate.toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Badge variant="outline" className={statusColors[a.status] || "bg-muted text-muted-foreground"}>
                        {a.status.replace("_", " ")}
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
