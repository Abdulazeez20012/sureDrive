import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  vin?: string;
  mileage?: number;
  lastInspectionDate?: string | null;
  nextInspectionDate?: string | null;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchVehicle: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Vehicle>;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

const useVehicleStore = create<VehicleState>()(
  devtools(
    persist(
      (set, get) => ({
        vehicles: [],
        currentVehicle: null,
        loading: false,
        error: null,
        
        fetchVehicles: async () => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.get('/vehicles');
            // const data = response.data;
            
            // For now, we'll use mock data
            const mockData: Vehicle[] = [
              {
                id: '1',
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                registrationNumber: 'ABC123',
                color: 'Silver',
                vin: 'JT2BF22K1W0123456',
                mileage: 25000,
                lastInspectionDate: '2023-05-15',
                nextInspectionDate: '2023-11-15',
                status: 'active',
                createdAt: '2023-01-15T00:00:00.000Z',
                updatedAt: '2023-05-15T00:00:00.000Z',
              },
              {
                id: '2',
                make: 'Honda',
                model: 'Civic',
                year: 2019,
                registrationNumber: 'XYZ789',
                color: 'Blue',
                vin: '2HGFC2F50KH123456',
                mileage: 32000,
                lastInspectionDate: '2023-04-10',
                nextInspectionDate: '2023-10-10',
                status: 'active',
                createdAt: '2022-11-20T00:00:00.000Z',
                updatedAt: '2023-04-10T00:00:00.000Z',
              },
              {
                id: '3',
                make: 'Ford',
                model: 'Focus',
                year: 2021,
                registrationNumber: 'DEF456',
                color: 'Red',
                vin: '1FADP3F20EL123456',
                mileage: 15000,
                lastInspectionDate: null,
                nextInspectionDate: '2023-12-01',
                status: 'pending',
                createdAt: '2023-03-05T00:00:00.000Z',
                updatedAt: '2023-03-05T00:00:00.000Z',
              },
              {
                id: '4',
                make: 'Nissan',
                model: 'Altima',
                year: 2018,
                registrationNumber: 'GHI789',
                color: 'Black',
                vin: '1N4AL3AP8JC123456',
                mileage: 45000,
                lastInspectionDate: '2023-02-20',
                nextInspectionDate: '2023-08-20',
                status: 'active',
                createdAt: '2022-08-15T00:00:00.000Z',
                updatedAt: '2023-02-20T00:00:00.000Z',
              },
            ];
            
            set({ vehicles: mockData, loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Failed to fetch vehicles', loading: false });
          }
        },
        
        fetchVehicle: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.get(`/vehicles/${id}`);
            // const data = response.data;
            
            // For now, we'll find the vehicle in our mock data
            const vehicle = get().vehicles.find(v => v.id === id);
            
            if (!vehicle) {
              throw new Error('Vehicle not found');
            }
            
            set({ currentVehicle: vehicle, loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Failed to fetch vehicle', loading: false });
          }
        },
        
        addVehicle: async (vehicleData) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.post('/vehicles', vehicleData);
            // const newVehicle = response.data;
            
            // For now, we'll create a mock vehicle
            const newVehicle: Vehicle = {
              ...vehicleData,
              id: Math.random().toString(36).substring(2, 15),
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            set(state => ({
              vehicles: [...state.vehicles, newVehicle],
              loading: false,
            }));
            
            return newVehicle;
          } catch (error: any) {
            set({ error: error.message || 'Failed to add vehicle', loading: false });
            throw error;
          }
        },
        
        updateVehicle: async (id: string, vehicleData: Partial<Vehicle>) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.put(`/vehicles/${id}`, vehicleData);
            // const updatedVehicle = response.data;
            
            // For now, we'll update the vehicle in our mock data
            const vehicles = get().vehicles;
            const index = vehicles.findIndex(v => v.id === id);
            
            if (index === -1) {
              throw new Error('Vehicle not found');
            }
            
            const updatedVehicle: Vehicle = {
              ...vehicles[index],
              ...vehicleData,
              updatedAt: new Date().toISOString(),
            };
            
            const updatedVehicles = [...vehicles];
            updatedVehicles[index] = updatedVehicle;
            
            set({
              vehicles: updatedVehicles,
              currentVehicle: updatedVehicle,
              loading: false,
            });
            
            return updatedVehicle;
          } catch (error: any) {
            set({ error: error.message || 'Failed to update vehicle', loading: false });
            throw error;
          }
        },
        
        deleteVehicle: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // await api.delete(`/vehicles/${id}`);
            
            // For now, we'll remove the vehicle from our mock data
            const vehicles = get().vehicles;
            const updatedVehicles = vehicles.filter(v => v.id !== id);
            
            set({
              vehicles: updatedVehicles,
              currentVehicle: get().currentVehicle?.id === id ? null : get().currentVehicle,
              loading: false,
            });
          } catch (error: any) {
            set({ error: error.message || 'Failed to delete vehicle', loading: false });
            throw error;
          }
        },
        
        clearError: () => set({ error: null }),
        
        resetState: () => set({
          vehicles: [],
          currentVehicle: null,
          loading: false,
          error: null,
        }),
      }),
      {
        name: 'vehicle-store',
        partialize: (state) => ({
          vehicles: state.vehicles,
        }),
      }
    )
  )
);

export default useVehicleStore;