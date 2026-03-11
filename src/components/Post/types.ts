import { IPostDTO } from "@/models/Post";

export interface IMetadata {
  fontSize: string;
  backgroundColor: string;
  background: string;
  location: string;
  audience: string;
  relationSheep: string;
  calendar: string;
  idCard: string;
  image: string;
  imagePublicId: string;
  tags: string[];
  category: string;
  author: string;
  contact: string;
  startDate: string;
  endDate: string;
  visibility: string;
  priority: string;
  pinned: boolean;
  link: string;
  attachments: string[];
  textAlign: string;
  fontWeight: string;
  lineHeight: string;
  ctaText: string;
  ctaUrl: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  description: string;
  metadata: IMetadata;
}

export interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  post?: IPostDTO;
  mode?: "create" | "edit";
}

export const LENGTH_LIMIT = 140;
