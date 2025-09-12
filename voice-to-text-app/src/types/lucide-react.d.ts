declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export const Stethoscope: ComponentType<LucideProps>;
  export const Play: ComponentType<LucideProps>;
  export const Square: ComponentType<LucideProps>;
  export const Edit3: ComponentType<LucideProps>;
  export const Trash2: ComponentType<LucideProps>;
  export const Plus: ComponentType<LucideProps>;
  export const Mic: ComponentType<LucideProps>;
  export const MicOff: ComponentType<LucideProps>;
}
