import {
  LayoutDashboard, Heart, Users, Building2, Truck,
  Target, GitBranch, Layers, SlidersHorizontal, Megaphone,
  BookOpen, Upload, Zap
} from 'lucide-vue-next'
import type { Component } from 'vue'

export type Vista =
  | 'dashboard' | 'plan-liga' | 'contactos' | 'empresas' | 'proveedores'
  | 'servicios' | 'oportunidades' | 'embudos' | 'segmentacion'
  | 'relacionamiento' | 'campanas' | 'importacion' | 'automatizaciones'

export interface Tab { 
  key: Vista; 
  label: string; 
  icono: Component 
}

export interface MenuGroup { 
  label?: string; 
  items: Tab[] 
}

export const MAX_TABS = 4;

export const menuGroups: MenuGroup[] = [
  { items: [
    { key: 'dashboard',        label: 'Dashboard',                 icono: LayoutDashboard },
  ]},
  { label: 'Plan Liga', items: [
    { key: 'plan-liga',       label: 'Titulares y Beneficiarios', icono: Heart           },
  ]},
  { label: 'Comercial', items: [
    { key: 'contactos',        label: 'Contactos',                icono: Users           },
    { key: 'empresas',         label: 'Empresas',                 icono: Building2       },
    { key: 'proveedores',      label: 'Proveedores',              icono: Truck           },
    { key: 'oportunidades',    label: 'Oportunidades',            icono: Target          },
    { key: 'embudos',          label: 'Tablero',                  icono: GitBranch       },
  ]},
  { label: 'Marketing', items: [
    { key: 'servicios',        label: 'Servicios',                icono: Layers          },
    { key: 'segmentacion',     label: 'Segmentación',             icono: SlidersHorizontal},
    { key: 'campanas',         label: 'Campañas Masivas',         icono: Megaphone       },
  ]},
  { label: 'Operaciones', items: [
    { key: 'relacionamiento',  label: 'Bitácora',                 icono: BookOpen        },
    { key: 'importacion',      label: 'Importación Masiva',       icono: Upload          },
    { key: 'automatizaciones', label: 'Automatizaciones',         icono: Zap             },
  ]},
]

export const findMenuItem = (key: string): Tab | undefined => {
  for (const g of menuGroups) {
    const item = g.items.find(i => i.key === key)
    if (item) return item
  }
  return undefined
}