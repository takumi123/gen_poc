import { JsonValue } from '@prisma/client/runtime/library';
import { UserRole as PrismaUserRole, UserStatus as PrismaUserStatus, ProjectStatus as PrismaProjectStatus, ProposalStatus as PrismaProposalStatus, ContractStatus as PrismaContractStatus, BadgeType as PrismaBadgeType } from '@prisma/client';

export const UserRole = PrismaUserRole;
export type UserRole = PrismaUserRole;

export const UserStatus = PrismaUserStatus;
export type UserStatus = PrismaUserStatus;

export const ProjectStatus = PrismaProjectStatus;
export type ProjectStatus = PrismaProjectStatus;

export const ProposalStatus = PrismaProposalStatus;
export type ProposalStatus = PrismaProposalStatus;

export const ContractStatus = PrismaContractStatus;
export type ContractStatus = PrismaContractStatus;

export const BadgeType = PrismaBadgeType;
export type BadgeType = PrismaBadgeType;

export enum SearchType {
  PROJECT = 'PROJECT',
  COMPANY = 'COMPANY',
  ENGINEER = 'ENGINEER',
  BLOG = 'BLOG'
}

export enum NotificationType {
  NEW_PROPOSAL = 'NEW_PROPOSAL',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CONTRACT_COMPLETED = 'CONTRACT_COMPLETED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  BADGE_EARNED = 'BADGE_EARNED'
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  profileImageUrl: string | null;
  bio: string | null;
  
  // 企業向けフィールド
  companyName: string | null;
  companySize: number | null;
  industry: string | null;
  location: string | null;
  
  // エンジニア向けフィールド
  skills: JsonValue | null;
  experienceYears: number | null;
  portfolioUrl: string | null;
  
  // プロフィール設定
  isProfilePublic: boolean;
  emailVerifiedAt: Date | null;
  
  createdAt: Date;
  updatedAt: Date;

  // Relations
  projects?: Project[];
  proposals?: Proposal[];
  badges?: UserBadge[];
  receivedReviews?: Review[];
  blogPosts?: BlogPost[];
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date | null;
  requiredSkills: JsonValue | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  proposals?: Proposal[];
};

export type Proposal = {
  id: string;
  projectId: string;
  engineerId: string;
  proposalText: string;
  approachDescription: string;
  proposedBudget: number;
  proposedTimeline: string;
  attachments: JsonValue | null;
  status: ProposalStatus;
  rating: number | null;
  ratingComment: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  engineer: User;
  messages?: Message[];
};

export type Contract = {
  id: string;
  projectId: string;
  proposalId: string;
  contractAmount: number;
  startDate: Date;
  endDate: Date;
  deliverables: JsonValue | null;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  proposal: Proposal;
  messages?: Message[];
  reviews?: Review[];
};

export type Message = {
  id: string;
  contractId: string;
  senderId: string;
  parentId: string | null;
  messageBody: string;
  attachments: JsonValue | null;
  isTemplate: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
  parent: Message | null;
  replies?: Message[];
};

export type Review = {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  contract: Contract;
  reviewer: User;
};

export type UserBadge = {
  id: string;
  userId: string;
  badgeType: BadgeType;
  awardedAt: Date;
  user: User;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: {
    id: string;
    displayName: string;
    profileImageUrl: string | null;
    role: UserRole;
  };
};
