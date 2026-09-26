import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Lead, LeadStatus } from "../types/lead";
import Modal from "./Modal";
import { SpinnerInline } from "./Spinner";

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
};

interface LeadFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  lead?: Lead | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
}

const emptyValues: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  status: "new",
};

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const inputClassName =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60";

const LeadFormModal = ({
  open,
  mode,
  lead,
  isSubmitting = false,
  onClose,
  onSubmit,
}: LeadFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    defaultValues: lead ? { ...lead } : emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(lead ? { ...lead } : emptyValues);
    }
  }, [lead, open, reset]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit lead" : "Add lead"}
      description={
        mode === "edit"
          ? "Update contact details and pipeline status."
          : "Add a new lead to your pipeline."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="lead-name" className="label mb-2 block">
              Full name
            </label>
            <input
              id="lead-name"
              type="text"
              disabled={isSubmitting}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={inputClassName}
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="lead-email" className="label mb-2 block">
              Email address
            </label>
            <input
              id="lead-email"
              type="email"
              disabled={isSubmitting}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={inputClassName}
              placeholder="jane@company.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="lead-phone" className="label mb-2 block">
              Phone number
            </label>
            <input
              id="lead-phone"
              type="tel"
              disabled={isSubmitting}
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 8, message: "Phone number is too short" },
              })}
              className={inputClassName}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="lead-status" className="label mb-2 block">
              Status
            </label>
            <select
              id="lead-status"
              disabled={isSubmitting}
              {...register("status", { required: "Please select a status" })}
              className={inputClassName}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1.5 text-xs text-error">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-primary transition hover:bg-background disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary inline-flex h-11 min-w-32 items-center justify-center gap-2 px-4 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <SpinnerInline className="border-white/30 border-t-white" />
            )}
            {isSubmitting
              ? mode === "edit"
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
                ? "Save changes"
                : "Create lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
