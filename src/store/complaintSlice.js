import { createSlice } from '@reduxjs/toolkit';

// Utility to mock dates: hours ago
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const initialState = {
  list: [
    {
      id: 'COMP-001',
      title: 'No water in Block A rest rooms',
      category: 'water',
      priority: 'High',
      status: 'Pending',
      createdAt: hoursAgo(50), // Should trigger critical!
      description: 'The washrooms on the 2nd floor of Block A have no running water since yesterday.',
      remarks: [],
      isPublic: true,
      escalated: true,
      critical: true
    },
    {
      id: 'COMP-002',
      title: 'Wifi router down in Common Room',
      category: 'internet',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: hoursAgo(25), // Should trigger escalated
      description: 'Internet router is blinking red, no connection.',
      remarks: ['Technician assigned'],
      isPublic: true,
      escalated: true,
      critical: false
    },
    {
      id: 'COMP-003',
      title: 'AC not cooling in Room 102',
      category: 'electricity',
      priority: 'High',
      status: 'Resolved',
      createdAt: hoursAgo(100),
      description: 'The AC blows warm air.',
      remarks: ['Gas refilled', 'Issue closed'],
      isPublic: true,
      escalated: false,
      critical: false
    },
    {
      id: 'COMP-004',
      title: 'Pothole near the main entrance',
      category: 'road',
      priority: 'Medium',
      status: 'Pending',
      createdAt: hoursAgo(5),
      description: 'Huge pothole appeared after the rain.',
      remarks: [],
      isPublic: true,
      escalated: false,
      critical: false
    }
  ],
};

const getPriorityFromCategory = (category) => {
  const high = ['water', 'electricity', 'security', 'medical'];
  const medium = ['internet', 'road', 'plumbing', 'hostel'];
  if (high.includes(category)) return 'High';
  if (medium.includes(category)) return 'Medium';
  return 'Low';
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    addComplaint: (state, action) => {
      const { title, category, description, image } = action.payload;
      const newComplaint = {
        id: `COMP-00${state.list.length + 1}`,
        title,
        category,
        priority: getPriorityFromCategory(category),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        description,
        remarks: [],
        escalated: false,
        critical: false,
        image: image || null
      };
      state.list.unshift(newComplaint);
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const complaint = state.list.find((c) => c.id === id);
      if (complaint) {
        complaint.status = status;
        if(status === 'Resolved') {
            complaint.escalated = false;
            complaint.critical = false;
        }
      }
    },
    mergeComplaints: (state, action) => {
      // Merges source into destination
      const { sourceId, destinationId } = action.payload;
      const source = state.list.find(c => c.id === sourceId);
      const destination = state.list.find(c => c.id === destinationId);
      
      if (source && destination && source.id !== destination.id) {
        // Move source to resolved immediately
        source.status = 'Resolved';
        source.remarks.push(`Merged into primary complaint: ${destinationId}`);
        source.critical = false;
        source.escalated = false;
        
        // Add log to destination
        destination.remarks.push(`[SYSTEM] Merged similar report ${sourceId} into this ticket.`);
      }
    },
    addRemark: (state, action) => {
      const { id, remark } = action.payload;
      const complaint = state.list.find((c) => c.id === id);
      if (complaint) {
        complaint.remarks.push(remark);
      }
    },
    // Action called on load or interval to calculate escalation logic
    checkEscalations: (state) => {
      const now = new Date();
      state.list.forEach((complaint) => {
        if (complaint.status !== 'Resolved') {
            const created = new Date(complaint.createdAt);
            const diffTime = Math.abs(now - created);
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            
            if(diffHours >= 48) {
                complaint.critical = true;
                complaint.escalated = true;
            } else if (diffHours >= 24) {
                complaint.escalated = true;
            }
        }
      });
    }
  }
});

export const { addComplaint, updateStatus, addRemark, checkEscalations, mergeComplaints } = complaintSlice.actions;
export default complaintSlice.reducer;
