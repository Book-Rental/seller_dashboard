import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadyForPickup } from "../services/shipmentService";

export const useMarkReadyForPickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) =>
      markReadyForPickup(shipmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-orders"],
      });
    },
  });
};