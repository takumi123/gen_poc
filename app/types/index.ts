export interface User {
  id: string
  displayName: string
  profileImageUrl?: string | null
  role: 'CLIENT' | 'ENGINEER' | 'ADMIN'
}

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    displayName: string
    profileImageUrl?: string | null
  }
  proposals: {
    id: string
  }[]
  contract?: {
    id: string
    contractAmount: number
    startDate: string
    endDate: string
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  } | null
}

export interface Proposal {
  id: string
  projectId: string
  engineerId: string
  proposalText: string
  proposedBudget: number
  proposedTimeline: string
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  engineer: {
    id: string
    displayName: string
    profileImageUrl?: string | null
  }
  project: {
    id: string
    title: string
    budget: number
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  }
}

export interface Message {
  id: string
  contractId: string
  senderId: string
  messageBody: string
  createdAt: string
  sender: {
    id: string
    displayName: string
    profileImageUrl?: string | null
    role: 'CLIENT' | 'ENGINEER' | 'ADMIN'
  }
}
