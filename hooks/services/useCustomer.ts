import { useCallback, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Customer, customerService } from "@/services/api/customer.service";
import { useToastHelpers } from "@/components/ui/ToastSystem";

export function useCustomer() {
  const { user } = useUser();
  const { showErrorToast } = useToastHelpers();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Obtiene los datos del cliente actual
   */
  const fetchCustomer = useCallback(async () => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      const customerData = await customerService.getCustomerByUserId(user.id);

      if (customerData) {
        setCustomer(customerData);
        return customerData;
      }

      return null;
    } catch (error) {
      console.error("Error al obtener datos del cliente:", error);
      showErrorToast("No se pudieron cargar los datos del cliente");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, showErrorToast]);

  /**
   * Actualiza los datos del cliente
   */
  const updateCustomer = useCallback(
    async (
      data: Partial<
        Omit<Customer, "id" | "userId" | "email" | "createdAt" | "updatedAt">
      >
    ) => {
      if (!customer?.id) {
        showErrorToast(
          "No se encontró información del cliente para actualizar"
        );
        return null;
      }

      try {
        setLoading(true);
        const updatedCustomer = await customerService.updateCustomer(
          customer.id,
          data
        );
        setCustomer(updatedCustomer);
        return updatedCustomer;
      } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        showErrorToast("No se pudieron actualizar los datos del cliente");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [customer, showErrorToast]
  );

  return {
    customer,
    loading,
    fetchCustomer,
    updateCustomer,
  };
}
