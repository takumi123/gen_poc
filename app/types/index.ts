export enum UserRole {
  CLIENT = 'CLIENT',
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  
  // 企業向けフィールド
  companyName?: string | null;
  companySize?: number | null;
  industry?: string | null;
  location?: string | null;
  
  // エンジニア向けフィールド
  skills?: Record<string, number> | null;
  experienceYears?: number | null;
  portfolioUrl?: string | null;
  
  // プロフィール設定
  isProfilePublic: boolean;
  emailVerifiedAt?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;

  // Relations
  projects?: Project[];
  proposals?: Proposal[];
  badges?: UserBadge[];
  receivedReviews?: Review[];
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  budget: number;
  deadline?: Date;
  requiredSkills?: Record<string, string>;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  proposals?: Proposal[];
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface Proposal {
  id: string;
  projectId: string;
  engineerId: string;
  proposalText: string;
  approachDescription: string;
  proposedBudget: number;
  proposedTimeline: string;
  attachments?: Record<string, string>;
  status: ProposalStatus;
  rating?: number;
  ratingComment?: string;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  engineer: User;
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Contract {
  id: string;
  projectId: string;
  proposalId: string;
  contractAmount: number;
  startDate: Date;
  endDate: Date;
  deliverables?: Record<string, string>;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  proposal: Proposal;
  messages?: Message[];
  reviews?: Review[];
}

export interface Message {
  id: string;
  contractId: string;
  senderId: string;
  parentId?: string;
  messageBody: string;
  attachments?: Record<string, string>;
  isTemplate: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  contract: Contract;
  sender: User;
  parent?: Message;
  replies: Message[];
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  readAt: Date;
  message: Message;
  user: User;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  reaction: string;
  createdAt: Date;
  message: Message;
  user: User;
}

export enum BadgeType {
  FIRST_PROJECT = 'FIRST_PROJECT',
  FIVE_PROJECTS = 'FIVE_PROJECTS',
  TOP_RATED = 'TOP_RATED',
  QUICK_RESPONSE = 'QUICK_RESPONSE',
  EXPERT = 'EXPERT'
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  awardedAt: Date;
  user: User;
}

export enum NotificationType {
  NEW_PROPOSAL = 'NEW_PROPOSAL',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CONTRACT_COMPLETED = 'CONTRACT_COMPLETED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt?: Date;
  createdAt: Date;
  user: User;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  contract: Contract & {
    project: Project;
  };
  reviewer: User;
}
