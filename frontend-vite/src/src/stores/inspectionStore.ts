import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';

export interface InspectionItem {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'not_checked';
  notes?: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleRegistration?: string;
  date: string;
  status: 'pending' | 'passed' | 'failed';
  notes?: string;
  inspectorName?: string;
  items?: InspectionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InspectionBooking {
  id: string;
  vehicleId: string;
  date: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

interface InspectionState {
  inspections: Inspection[];
  currentInspection: Inspection | null;
  bookings: InspectionBooking[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchInspections: () => Promise<void>;
  fetchInspection: (id: string) => Promise<void>;
  bookInspection: (booking: Omit<InspectionBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<InspectionBooking>;
  updateInspection: (id: string, inspectionData: Partial<Inspection>) => Promise<Inspection>;
  cancelBooking: (id: string) => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

const useInspectionStore = create<InspectionState>()(
  devtools(
    persist(
      (set, get) => ({
        inspections: [],
        currentInspection: null,
        bookings: [],
        loading: false,
        error: null,
        
        fetchInspections: async () => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.get('/inspections');
            // const data = response.data;
            
            // For now, we'll use mock data
            const mockData: Inspection[] = [
              {
                id: '1',
                vehicleId: '1',
                vehicleMake: 'Toyota',
                vehicleModel: 'Camry',
                vehicleRegistration: 'ABC123',
                date: '2023-05-15T10:00:00.000Z',
                status: 'passed',
                notes: 'Vehicle in good condition',
                inspectorName: 'John Smith',
                items: [
                  { id: '1-1', name: 'Brakes', status: 'pass', notes: 'Good condition' },
                  { id: '1-2', name: 'Lights', status: 'pass', notes: 'All working properly' },
                  { id: '1-3', name: 'Tires', status: 'pass', notes: 'Good tread depth' },
                  { id: '1-4', name: 'Suspension', status: 'pass', notes: 'No issues' },
                  { id: '1-5', name: 'Exhaust', status: 'pass', notes: 'No leaks' },
                ],
                createdAt: '2023-05-15T09:30:00.000Z',
                updatedAt: '2023-05-15T11:15:00.000Z',
              },
              {
                id: '2',
                vehicleId: '2',
                vehicleMake: 'Honda',
                vehicleModel: 'Civic',
                vehicleRegistration: 'XYZ789',
                date: '2023-04-10T14:30:00.000Z',
                status: 'passed',
                notes: 'Minor issues with windshield wipers, but passed overall',
                inspectorName: 'Sarah Johnson',
                items: [
                  { id: '2-1', name: 'Brakes', status: 'pass', notes: 'Good condition' },
                  { id: '2-2', name: 'Lights', status: 'pass', notes: 'All working properly' },
                  { id: '2-3', name: 'Tires', status: 'pass', notes: 'Good tread depth' },
                  { id: '2-4', name: 'Suspension', status: 'pass', notes: 'No issues' },
                  { id: '2-5', name: 'Windshield Wipers', status: 'fail', notes: 'Need replacement soon' },
                ],
                createdAt: '2023-04-10T14:00:00.000Z',
                updatedAt: '2023-04-10T15:45:00.000Z',
              },
              {
                id: '3',
                vehicleId: '4',
                vehicleMake: 'Nissan',
                vehicleModel: 'Altima',
                vehicleRegistration: 'GHI789',
                date: '2023-02-20T11:00:00.000Z',
                status: 'failed',
                notes: 'Failed due to brake issues and exhaust problems',
                inspectorName: 'Mike Wilson',
                items: [
                  { id: '3-1', name: 'Brakes', status: 'fail', notes: 'Brake pads worn out' },
                  { id: '3-2', name: 'Lights', status: 'pass', notes: 'All working properly' },
                  { id: '3-3', name: 'Tires', status: 'pass', notes: 'Good tread depth' },
                  { id: '3-4', name: 'Suspension', status: 'pass', notes: 'No issues' },
                  { id: '3-5', name: 'Exhaust', status: 'fail', notes: 'Excessive emissions' },
                ],
                createdAt: '2023-02-20T10:30:00.000Z',
                updatedAt: '2023-02-20T12:15:00.000Z',
              },
              {
                id: '4',
                vehicleId: '3',
                vehicleMake: 'Ford',
                vehicleModel: 'Focus',
                vehicleRegistration: 'DEF456',
                date: '2023-12-01T09:00:00.000Z',
                status: 'pending',
                notes: 'Scheduled inspection',
                createdAt: '2023-11-15T14:30:00.000Z',
                updatedAt: '2023-11-15T14:30:00.000Z',
              },
            ];
            
            // Mock bookings
            const mockBookings: InspectionBooking[] = [
              {
                id: '1',
                vehicleId: '3',
                date: '2023-12-01T09:00:00.000Z',
                notes: 'First inspection for this vehicle',
                status: 'scheduled',
                createdAt: '2023-11-15T14:30:00.000Z',
                updatedAt: '2023-11-15T14:30:00.000Z',
              },
              {
                id: '2',
                vehicleId: '1',
                date: '2023-11-20T13:30:00.000Z',
                notes: 'Regular 6-month inspection',
                status: 'completed',
                createdAt: '2023-11-01T10:15:00.000Z',
                updatedAt: '2023-11-20T15:00:00.000Z',
              },
            ];
            
            set({ inspections: mockData, bookings: mockBookings, loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Failed to fetch inspections', loading: false });
          }
        },
        
        fetchInspection: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.get(`/inspections/${id}`);
            // const data = response.data;
            
            // For now, we'll find the inspection in our mock data
            const inspection = get().inspections.find(i => i.id === id);
            
            if (!inspection) {
              throw new Error('Inspection not found');
            }
            
            set({ currentInspection: inspection, loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Failed to fetch inspection', loading: false });
          }
        },
        
        bookInspection: async (bookingData) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.post('/inspections/book', bookingData);
            // const newBooking = response.data;
            
            // For now, we'll create a mock booking
            const newBooking: InspectionBooking = {
              ...bookingData,
              id: Math.random().toString(36).substring(2, 15),
              status: 'scheduled',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            // Also create a pending inspection
            const newInspection: Inspection = {
              id: Math.random().toString(36).substring(2, 15),
              vehicleId: bookingData.vehicleId,
              date: bookingData.date,
              status: 'pending',
              notes: bookingData.notes,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            set(state => ({
              bookings: [...state.bookings, newBooking],
              inspections: [...state.inspections, newInspection],
              loading: false,
            }));
            
            return newBooking;
          } catch (error: any) {
            set({ error: error.message || 'Failed to book inspection', loading: false });
            throw error;
          }
        },
        
        updateInspection: async (id: string, inspectionData: Partial<Inspection>) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // const response = await api.put(`/inspections/${id}`, inspectionData);
            // const updatedInspection = response.data;
            
            // For now, we'll update the inspection in our mock data
            const inspections = get().inspections;
            const index = inspections.findIndex(i => i.id === id);
            
            if (index === -1) {
              throw new Error('Inspection not found');
            }
            
            const updatedInspection: Inspection = {
              ...inspections[index],
              ...inspectionData,
              updatedAt: new Date().toISOString(),
            };
            
            const updatedInspections = [...inspections];
            updatedInspections[index] = updatedInspection;
            
            set({
              inspections: updatedInspections,
              currentInspection: updatedInspection,
              loading: false,
            });
            
            return updatedInspection;
          } catch (error: any) {
            set({ error: error.message || 'Failed to update inspection', loading: false });
            throw error;
          }
        },
        
        cancelBooking: async (id: string) => {
          try {
            set({ loading: true, error: null });
            
            // In a real application, this would be an API call
            // await api.put(`/inspections/bookings/${id}/cancel`);
            
            // For now, we'll update the booking in our mock data
            const bookings = get().bookings;
            const index = bookings.findIndex(b => b.id === id);
            
            if (index === -1) {
              throw new Error('Booking not found');
            }
            
            const updatedBooking: InspectionBooking = {
              ...bookings[index],
              status: 'cancelled',
              updatedAt: new Date().toISOString(),
            };
            
            const updatedBookings = [...bookings];
            updatedBookings[index] = updatedBooking;
            
            // Also update any pending inspections related to this booking
            const inspections = get().inspections;
            const pendingInspectionIndex = inspections.findIndex(
              i => i.vehicleId === updatedBooking.vehicleId && i.status === 'pending'
            );
            
            let updatedInspections = [...inspections];
            
            if (pendingInspectionIndex !== -1) {
              // Remove the pending inspection
              updatedInspections = updatedInspections.filter((_, idx) => idx !== pendingInspectionIndex);
            }
            
            set({
              bookings: updatedBookings,
              inspections: updatedInspections,
              loading: false,
            });
          } catch (error: any) {
            set({ error: error.message || 'Failed to cancel booking', loading: false });
            throw error;
          }
        },
        
        clearError: () => set({ error: null }),
        
        resetState: () => set({
          inspections: [],
          currentInspection: null,
          bookings: [],
          loading: false,
          error: null,
        }),
      }),
      {
        name: 'inspection-store',
        partialize: (state) => ({
          inspections: state.inspections,
          bookings: state.bookings,
        }),
      }
    )
  )
);

export default useInspectionStore;