export interface Design {
  id: number;
  name: string;
  description: string;
  preview_url?: string | null;
  data: any;
  created_by: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
