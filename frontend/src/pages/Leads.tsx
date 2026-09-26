import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import toast from "react-hot-toast";

import LeadFormModal from "../ui/LeadFormModal";

import LeadTable from "../features/leads/LeadsTable";
import LeadsTableOperations from "../features/leads/LeadTableOperations";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

import {
  useCreateLead,
  useDeleteLead,
  useLeads,
  useUpdateLead,
} from "../features/leads/useLeads";

import type { Lead, LeadFormValues, LeadStatus } from "../types/lead";

const PAGE_SIZE = 10;

const Leads = () => {
  const [searchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  //* --------------------------------
  //* URL parameters
  //* --------------------------------

  const search = (searchParams.get("search") ?? "").trim();

  const statusParam = searchParams.get("status");

  const status: LeadStatus | undefined =
    statusParam && statusParam !== "all"
      ? (statusParam as LeadStatus)
      : undefined;

  const sortParam = searchParams.get("sortBy") ?? "createdAt-desc";

  const [sortBy, sortOrder] = sortParam.split("-");

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  //* --------------------------------
  //* GET
  //* --------------------------------

  const { data, isLoading, isError, error } = useLeads({
    search,
    status,
    sortBy,
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
    page: currentPage,
    limit: PAGE_SIZE,
  });

  //* --------------------------------
  //* CREATE
  //* --------------------------------

  const createMutation = useCreateLead();

  //* --------------------------------
  //* UPDATE
  //* --------------------------------

  const updateMutation = useUpdateLead();

  //* --------------------------------
  //* DELETE
  //* --------------------------------

  const deleteMutation = useDeleteLead();

  //* --------------------------------
  //* Data
  //* --------------------------------

  const leads = data?.data ?? [];

  const pagination = data?.pagination;

  const totalCount = pagination?.totalLeads ?? 0;

  const safePage = pagination?.page ?? 1;

  //* --------------------------------
  //* Form modal
  //* --------------------------------

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
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    resetFormState();
  };

  //* --------------------------------
  //* CREATE / UPDATE
  //* --------------------------------

  const handleCreateOrUpdate = async (values: LeadFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);

        toast.success("Lead created successfully");
      }

      if (mode === "edit" && selectedLead) {
        await updateMutation.mutateAsync({
          id: selectedLead.id,
          values,
        });

        toast.success("Lead updated successfully");
      }

      resetFormState();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  //* --------------------------------
  //* DELETE
  //* --------------------------------

  const requestDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
  };

  const closeDeleteModal = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setLeadToDelete(null);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(leadToDelete.id);

      toast.success("Lead deleted successfully");

      setLeadToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete lead. Please try again.",
      );
    }
  };

  //* --------------------------------
  //* GET error
  //* --------------------------------

  if (isError) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h1 className="page-title">Something went wrong</h1>

          <p className="secondary-text mt-2">
            {error instanceof Error ? error.message : "Failed to load leads."}
          </p>
        </div>
      </div>
    );
  }

  //* --------------------------------
  //* UI
  //* --------------------------------

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Pipeline
          </p>

          <h1 className="page-title mt-2">All leads</h1>

          <p className="secondary-text mt-1.5">
            Manage and track your pipeline · {totalCount} total
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
          leads={leads}
          isLoading={isLoading}
          isDeletingId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
          onEdit={openEditModal}
          onDelete={requestDeleteLead}
          onAddLead={openCreateModal}
          totalCount={totalCount}
          pageSize={pagination?.limit ?? PAGE_SIZE}
          currentPage={safePage}
        />
      </div>

      <LeadFormModal
        open={isFormOpen}
        mode={mode}
        lead={selectedLead}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDeleteModal
        open={Boolean(leadToDelete)}
        leadName={leadToDelete?.name}
        isDeleting={deleteMutation.isPending}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteLead}
      />
    </div>
  );
};

export default Leads;
