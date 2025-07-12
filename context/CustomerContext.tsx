import React, { createContext, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Customer } from "@/services/api/customer.service";
import { useCustomer } from "@/hooks/services/useCustomer";

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  refreshCustomer: () => Promise<Customer | null>;
  updateCustomerData: (
    data: Partial<
      Omit<Customer, "id" | "userId" | "email" | "createdAt" | "updatedAt">
    >
  ) => Promise<Customer | null>;
}

const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  loading: false,
  refreshCustomer: async () => null,
  updateCustomerData: async () => null,
});

export const useCustomerContext = () => useContext(CustomerContext);

interface CustomerProviderProps {
  children: React.ReactNode;
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const { isSignedIn } = useUser();
  const { customer, loading, fetchCustomer, updateCustomer } = useCustomer();

  useEffect(() => {
    if (isSignedIn) {
      fetchCustomer();
    }
  }, [isSignedIn, fetchCustomer]);

  const value = {
    customer,
    loading,
    refreshCustomer: fetchCustomer,
    updateCustomerData: updateCustomer,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}
