import { SVGAttributes } from 'react';
import { getR2Url } from '@/utils/imageHelper';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img {...props} src={getR2Url('/cahayanbiyalogo.png')} alt="Cahaya Anbiya Logo" className={`object-contain ${props.className || ''}`} onError={(e) => {
        const target = e.currentTarget;
        if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
            target.src = '/cahayanbiyalogo.png';
        }
    }} />;
}
