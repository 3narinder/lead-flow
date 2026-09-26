import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
  type GetLeadsParams,
} from "../../services/leadsService";

import type { LeadFormValues } from "../../types/lead";

// GET
export const useLeads = (params: GetLeadsParams) => {
  return useQuery({
    queryKey: ["leads", params],

    queryFn: () => getLeads(params),

    placeholderData: keepPreviousData,
  });
};

// CREATE
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LeadFormValues) => createLead(values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
};

// UPDATE
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: LeadFormValues }) =>
      updateLead(id, values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
};

// DELETE
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
};
