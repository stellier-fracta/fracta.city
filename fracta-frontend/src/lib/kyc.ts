const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1`;

export interface KYCSubmission {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  kycType: 'prospera-permit' | 'international-kyc';
  jurisdiction: 'prospera' | 'international';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents?: {
    front?: string;
    back?: string;
    faceScan?: string;
  };
  personalInfo?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    permitNumber?: string;
  };
}

export interface ProsperaKYCData {
  prospera_permit_id: string;
  prospera_permit_type: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  permitImage?: File;
}

export interface InternationalKYCData {
  document_type: string;
  document_number: string;
  document_country: string;
  document_expiry: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province?: string;
  postal_code: string;
  address_country: string;
  documents?: {
    front?: string;
    back?: string;
    faceScan?: string;
  };
}

export class KYCService {
  static async submitProsperaKYC(data: ProsperaKYCData): Promise<unknown> {
    console.log('Submitting Prospera KYC:', data);
    
    const response = await fetch(`${API_BASE_URL}/kyc/test-prospera-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prospera_permit_id: data.prospera_permit_id,
        prospera_permit_type: data.prospera_permit_type,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        nationality: data.nationality
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`KYC submission failed: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  static async submitInternationalKYC(data: InternationalKYCData): Promise<unknown> {
    console.log('Submitting International KYC:', data);
    
    const response = await fetch(`${API_BASE_URL}/kyc/international-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`KYC submission failed: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  static async getKYCStatus(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/kyc/status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get KYC status: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getKYCRecords(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/kyc/records`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get KYC records: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Admin endpoints
  static async getAdminKYCSubmissions(filters?: {
    status?: string;
    jurisdiction?: string;
    limit?: number;
  }): Promise<KYCSubmission[]> {
    try {
      console.log('Getting admin KYC submissions with filters:', filters);
      
      // Mock admin submissions
      const mockSubmissions: KYCSubmission[] = [
        {
          id: 1,
          userId: 1,
          userEmail: 'john@example.com',
          userName: 'John Doe',
          kycType: 'prospera-permit',
          jurisdiction: 'prospera',
          status: 'pending',
          submittedAt: new Date().toISOString(),
          documents: {
            front: 'mock_front_url',
            back: undefined,
            faceScan: undefined
          },
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            nationality: 'US',
            permitNumber: 'P123456789'
          }
        },
        {
          id: 2,
          userId: 2,
          userEmail: 'jane@example.com',
          userName: 'Jane Smith',
          kycType: 'international-kyc',
          jurisdiction: 'international',
          status: 'approved',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          documents: {
            front: 'mock_front_url',
            back: 'mock_back_url',
            faceScan: 'mock_face_url'
          },
          personalInfo: {
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: '1985-05-15',
            nationality: 'CA',
            permitNumber: 'I123456789'
          }
        }
      ];

      // Apply filters
      let filteredSubmissions = mockSubmissions;
      
      if (filters?.status) {
        filteredSubmissions = filteredSubmissions.filter(s => s.status === filters.status);
      }
      
      if (filters?.jurisdiction) {
        filteredSubmissions = filteredSubmissions.filter(s => s.jurisdiction === filters.jurisdiction);
      }
      
      if (filters?.limit) {
        filteredSubmissions = filteredSubmissions.slice(0, filters.limit);
      }

      return filteredSubmissions;
    } catch (error) {
      console.error('Error fetching admin KYC submissions:', error);
      throw new Error('Failed to fetch KYC submissions');
    }
  }

  static async approveKYC(kycId: number): Promise<unknown> {
    console.log('Approving KYC:', kycId);
    
    const response = await fetch(`${API_BASE_URL}/kyc/test-admin/${kycId}/approve`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to approve KYC: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async rejectKYC(kycId: number, reason: string): Promise<unknown> {
    console.log('Rejecting KYC:', kycId, 'with reason:', reason);
    
    const response = await fetch(`${API_BASE_URL}/kyc/test-admin/${kycId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reject KYC: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getKYCSubmissionDetails(kycId: number): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/kyc/admin/${kycId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get KYC details: ${response.statusText}`);
    }
    
    return response.json();
  }
} 