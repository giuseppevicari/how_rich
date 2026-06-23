export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ComparisonCategory = 'consumer' | 'asset' | 'benchmark'
export type RefreshStatus = 'success' | 'failure' | 'partial'

export interface Database {
  public: {
    Tables: {
      billionaires: {
        Row: {
          id: string
          name: string
          image_url: string | null
          slug: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['billionaires']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['billionaires']['Insert']>
      }
      wealth_snapshots: {
        Row: {
          id: string
          billionaire_id: string
          date: string
          net_worth: number
          rank: number
          source: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wealth_snapshots']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wealth_snapshots']['Insert']>
      }
      comparison_units: {
        Row: {
          id: string
          name: string
          slug: string
          category: ComparisonCategory
          value: number
          icon_url: string | null
          description: string | null
          source_url: string | null
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['comparison_units']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['comparison_units']['Insert']>
      }
      refresh_logs: {
        Row: {
          id: string
          started_at: string
          completed_at: string | null
          status: RefreshStatus
          message: string | null
        }
        Insert: Omit<Database['public']['Tables']['refresh_logs']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['refresh_logs']['Insert']>
      }
    }
  }
}

export type Billionaire = Database['public']['Tables']['billionaires']['Row']
export type WealthSnapshot = Database['public']['Tables']['wealth_snapshots']['Row']
export type ComparisonUnit = Database['public']['Tables']['comparison_units']['Row']
export type RefreshLog = Database['public']['Tables']['refresh_logs']['Row']

export interface BillionaireWithSnapshot extends Billionaire {
  latestSnapshot: WealthSnapshot | null
}
