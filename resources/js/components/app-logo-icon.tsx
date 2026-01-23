import { SVGAttributes } from 'react';
import { getR2Url } from '@/utils/imageHelper';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img {...props} src={getR2Url('/cahayanbiyalogo.png')} alt="Cahaya Anbiya Logo" className={`object-contain ${props.className || ''}`} onError={(e) => {
        const target = e.currentTarget;
        if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
            // Try alternative R2 path variations, never fallback to local
            const currentUrl = target.src;
            let altPath = currentUrl;
            if (currentUrl.includes('/public/images/')) {
                altPath = currentUrl.replace('/public/images/', '/images/');
            } else if (currentUrl.includes('/public/')) {
                altPath = currentUrl.replace('/public/', '/');
            } else if (currentUrl.includes('/images/')) {
                altPath = currentUrl.replace('/images/', '/public/images/');
            } else {
                altPath = 'https://assets.cahayaanbiya.com/public/images/cahayanbiyalogo.png';
            }
            console.log('[Logo] Trying alternative R2 path:', altPath);
            target.src = altPath;
        }
    }} />;
}
