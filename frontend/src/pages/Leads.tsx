import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { leads as initialLeads } from "../data/leads";
import LeadTable from "../features/leads/LeadsTable";
import LeadsTableOperations from "../features/leads/LeadTableOperations";
import { simulateRequest } from "../lib/toastConfig";
import type { Lead } from "../types/lead";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import LeadFormModal, { type LeadFormValues } from "../ui/LeadFormModal";

const PAGE_SIZE = 10;

const sortLeads = (items: Lead[], sortBy: string) => {
  const sorted = [...items];

  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "createdAt-asc":
      return sorted.sort((a, b) => Number(a.id) - Number(b.id));
    case "createdAt-desc":
    default:
      return sorted.sort((a, b) => Number(b.id) - Number(a.id));
  }
};

const Leads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leadList, setLeadList] = useState<Lead[]>(initialLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const statusFilter = searchParams.get("status") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "createdAt-desc";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const filteredLeads = useMemo(() => {
    let result = leadList;

    if (search) {
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.phone.includes(search),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    return sortLeads(result, sortBy);
  }, [leadList, search, sortBy, statusFilter]);

  const totalCount = filteredLeads.length;
  const pageCount =
    totalCount === 0 ? 0 : Math.ceil(totalCount / PAGE_SIZE);
  const safePage =
    pageCount === 0 ? 1 : Math.min(currentPage, Math.max(1, pageCount));

  useEffect(() => {
    if (pageCount === 0 || currentPage === safePage) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(safePage));
    setSearchParams(newParams, { replace: true });
  }, [currentPage, pageCount, safePage, searchParams, setSearchParams]);

  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [safePage, filteredLeads]);

  const openCreateModal = () => {
    setSelectedLead(null);
    setMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setMode("edit");
    setIsFormOpen(true);
  };

  const resetFormState = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
    setMode("create");
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    resetFormState();
  };

  const handleCreateOrUpdate = async (values: LeadFormValues) => {
    setIsSubmitting(true);

    const loadingMessage =
      mode === "create" ? "Creating lead..." : "Saving changes...";
    const toastId = toast.loading(loadingMessage);

    try {
      await simulateRequest();

      if (mode === "create") {
        const nextLead: Lead = {
          id: crypto.randomUUID(),
          ...values,
        };

        setLeadList((current) => [nextLead, ...current]);
        toast.success("Lead created successfully", { id: toastId });
      } else if (selectedLead) {
        setLeadList((current) =>
          current.map((lead) =>
            lead.id === selectedLead.id ? { ...lead, ...values } : lead,
          ),
        );
        toast.success("Lead updated successfully", { id: toastId });
      } else {
        toast.dismiss(toastId);
      }

      resetFormState();
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setLeadToDelete(null);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;

    setDeletingId(leadToDelete.id);
    const toastId = toast.loading("Deleting lead...");

    try {
      await simulateRequest(500);
      setLeadList((current) =>
        current.filter((item) => item.id !== leadToDelete.id),
      );
      toast.success("Lead deleted successfully", { id: toastId });
      setLeadToDelete(null);
    } catch {
      toast.error("Could not delete lead. Please try again.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Pipeline
          </p>
          <h1 className="page-title mt-2">All leads</h1>
          <p className="secondary-text mt-1.5">
            Manage and track your pipeline · {leadList.length} total
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary inline-flex h-11 w-fit items-center gap-2 px-5"
        >
          <span className="text-lg leading-none">+</span>
          Add lead
        </button>
      </div>

      <LeadsTableOperations />

      <div className="w-full">
        <LeadTable
          leads={paginatedLeads}
          isLoading={false}
          isDeletingId={deletingId}
          onEdit={openEditModal}
          onDelete={requestDeleteLead}
          onAddLead={openCreateModal}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={safePage}
        />
      </div>

      <LeadFormModal
        open={isFormOpen}
        mode={mode}
        lead={selectedLead}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDeleteModal
        open={Boolean(leadToDelete)}
        leadName={leadToDelete?.name}
        isDeleting={Boolean(deletingId && leadToDelete?.id === deletingId)}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteLead}
      />
    </div>
  );
};

export default Leads;
