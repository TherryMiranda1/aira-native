import { apiClient } from "./apiClient";
import { API_CONFIG } from "./config";
import { stringify } from "qs-esm";

export interface Customer {
  id: string;
  userId: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  polarCustomerId?: string;
  credits: number;
  role: "basic" | "pro" | "enterprise";
  subscriptionStatus: "active" | "inactive" | "cancelled" | "expired";
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const customerService = {
  async getCustomerByUserId(userId: string): Promise<Customer | null> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "100",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CUSTOMERS}${queryString}`
      );
      if (response.data.docs && response.data.docs.length > 0) {
        return response.data.docs[0];
      }

      return null;
    } catch (error) {
      console.error(`Error al obtener el cliente con userId ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene el cliente por su ID
   */
  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      return null;
    }
  },

  async updateCustomer(
    id: string,
    data: Partial<
      Omit<Customer, "id" | "userId" | "email" | "createdAt" | "updatedAt">
    >
  ): Promise<Customer> {
    try {
      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el cliente con ID ${id}:`, error);
      throw error;
    }
  },
};
